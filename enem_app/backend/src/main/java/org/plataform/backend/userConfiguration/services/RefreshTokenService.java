package org.plataform.backend.userConfiguration.services;

import org.plataform.backend.userConfiguration.entity.RefreshToken;
import org.plataform.backend.userConfiguration.repositories.RefreshTokenRepository;
import org.plataform.backend.userConfiguration.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration:604800000}") // 7 dias em ms
    private Long refreshTokenDuration;

    public RefreshToken createRefreshToken(User user) {
        // Revoga todos os refresh tokens existentes do usuário
        refreshTokenRepository.revokeAllByUser(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshTokenDuration / 1000));
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByTokenAndRevokedFalse(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expirado. Faça login novamente.");
        }
        return token;
    }

    public void revokeToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado!"));

        if (refreshToken.getRevoked()) {
            throw new RuntimeException("Refresh token já foi revogado!");
        }

        refreshTokenRepository.revokeByToken(token);
    }

    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }

    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}