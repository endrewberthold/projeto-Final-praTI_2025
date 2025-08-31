package org.plataform.backend.userConfiguration.services;

import org.plataform.backend.userConfiguration.dtos.*;
import org.plataform.backend.userConfiguration.entity.RefreshToken;
import org.plataform.backend.userConfiguration.repositories.UserRepository;
import org.plataform.backend.userConfiguration.user.User;
import org.plataform.backend.userConfiguration.user.UserRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    // Adicionando o logger para registrar eventos
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserResponse registerUser(UserRequest userRequest) {
        return registerUserWithRole(userRequest, UserRole.USER);
    }

    public UserResponse registerAdmin(UserRequest userRequest) {
        return registerUserWithRole(userRequest, UserRole.ADMIN);
    }

    private UserResponse registerUserWithRole(UserRequest userRequest, UserRole role) {
        if (userRepository.existsByEmail(userRequest.email())) {
            logger.warn("Tentativa de registro de e-mail duplicado: {}", userRequest.email());
            throw new RuntimeException("Email já cadastrado!");
        }

        User user = new User(userRequest);
        user.setPassword_hash(passwordEncoder.encode(userRequest.password()));
        user.setRole(role);
        user.setProvider("local");
        user.setIsOauthUser(false);

        User savedUser = userRepository.save(user);
        logger.info("Novo usuário registrado com sucesso: {}", savedUser.getEmail());
        return new UserResponse(savedUser);
    }

    public LoginResponse authenticate(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> {
                    logger.warn("Falha de login: Usuário não encontrado com o e-mail: {}", loginRequest.email());
                    return new RuntimeException("Usuário não encontrado");
                });

        String accessToken = jwtService.generateToken(user, user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        // Mensagem de sucesso para o login
        logger.info("Login bem-sucedido. Novo token de acesso e refresh token gerados para o usuário: {}", user.getEmail());

        return new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                "Bearer",
                jwtService.getExpirationTime(),
                new UserResponse(user)
        );
    }

    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.refreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user, user.getRole().name());
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

                    // Mensagem de sucesso para o refresh token
                    logger.info("Token de acesso renovado com sucesso para o usuário: {}", user.getEmail());

                    return new RefreshTokenResponse(
                            accessToken,
                            newRefreshToken.getToken(),
                            "Bearer",
                            jwtService.getExpirationTime()
                    );
                })
                .orElseThrow(() -> {
                    logger.warn("Tentativa de uso de refresh token inválido ou expirado.");
                    return new RuntimeException("Refresh token inválido!");
                });
    }

    public void logout(String refreshToken) {
        RefreshToken token = refreshTokenService.findByToken(refreshToken)
                .orElseThrow(() -> {
                    logger.warn("Tentativa de logout com refresh token não encontrado.");
                    return new RuntimeException("Refresh token inválido ou não encontrado!");
                });

        refreshTokenService.revokeToken(refreshToken);

        // Mensagem de sucesso para o logout
        logger.info("Logout realizado com sucesso. Token revogado para o usuário: {}", token.getUser().getEmail());
    }
}
