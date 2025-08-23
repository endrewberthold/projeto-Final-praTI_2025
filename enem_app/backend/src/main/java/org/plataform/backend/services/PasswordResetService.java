package org.plataform.backend.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.plataform.backend.dtos.*;
import org.plataform.backend.repositories.PasswordResetTokenRepository;
import org.plataform.backend.repositories.UserRepository;
import org.plataform.backend.user.PasswordResetToken;
import org.plataform.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; // Você precisa criar este service

    /**
     * Solicita recuperação de senha
     */
    @Transactional
    public ForgotPasswordResponse requestPasswordReset(ForgotPasswordRequest request) {
        try {
            // Buscar usuário por email
            Optional<User> userOpt = userRepository.findByEmail(request.email());

            if (userOpt.isEmpty()) {
                // Por segurança, sempre retornar sucesso mesmo se email não existir
                log.warn("Tentativa de recuperação de senha para email inexistente: {}", request.email());
                return new ForgotPasswordResponse(
                        "Se o email existir em nossa base, você receberá instruções para recuperação da senha.",
                        true
                );
            }

            User user = userOpt.get();

            // Verificar se não há token recente (últimos 5 minutos) - rate limiting
            if (passwordResetTokenRepository.hasRecentActiveToken(user, LocalDateTime.now().minusMinutes(5))) {
                return new ForgotPasswordResponse(
                        "Já foi enviado um email de recuperação recentemente. Verifique sua caixa de entrada ou aguarde alguns minutos.",
                        false
                );
            }

            // Invalidar tokens anteriores do usuário
            passwordResetTokenRepository.markAllUserTokensAsUsed(user);

            // Criar novo token
            PasswordResetToken resetToken = new PasswordResetToken(user);
            passwordResetTokenRepository.save(resetToken);

            // Enviar email
            emailService.sendPasswordResetEmail(user, resetToken.getToken());

            log.info("Token de recuperação de senha criado para usuário: {}", user.getEmail());

            return new ForgotPasswordResponse(
                    "Instruções para recuperação da senha foram enviadas para seu email.",
                    true
            );

        } catch (Exception e) {
            log.error("Erro ao processar solicitação de recuperação de senha", e);
            return new ForgotPasswordResponse(
                    "Erro interno do servidor. Tente novamente mais tarde.",
                    false
            );
        }
    }

    /**
     * Valida se um token é válido
     */
    public ValidateTokenResponse validateResetToken(String token) {
        try {
            Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository
                    .findByTokenAndUsedFalseAndExpiresAtAfter(token, LocalDateTime.now());

            if (tokenOpt.isEmpty()) {
                return new ValidateTokenResponse(false, "Token inválido ou expirado.", null);
            }

            PasswordResetToken resetToken = tokenOpt.get();
            return new ValidateTokenResponse(
                    true,
                    "Token válido.",
                    resetToken.getUser().getEmail()
            );

        } catch (Exception e) {
            log.error("Erro ao validar token de recuperação", e);
            return new ValidateTokenResponse(false, "Erro ao validar token.", null);
        }
    }

    /**
     * Redefine a senha do usuário
     */
    @Transactional
    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        try {
            // Validar se as senhas conferem
            if (!request.passwordsMatch()) {
                return new ResetPasswordResponse(
                        "As senhas não conferem.",
                        false
                );
            }

            // Buscar token válido
            Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository
                    .findByTokenAndUsedFalseAndExpiresAtAfter(request.token(), LocalDateTime.now());

            if (tokenOpt.isEmpty()) {
                return new ResetPasswordResponse(
                        "Token inválido ou expirado.",
                        false
                );
            }

            PasswordResetToken resetToken = tokenOpt.get();
            User user = resetToken.getUser();

            // Atualizar senha do usuário
            user.setPassword_hash(passwordEncoder.encode(request.newPassword()));
            userRepository.save(user);

            // Marcar token como usado
            resetToken.markAsUsed();
            passwordResetTokenRepository.save(resetToken);

            // Invalidar outros tokens do usuário
            passwordResetTokenRepository.markAllUserTokensAsUsed(user);

            log.info("Senha redefinida com sucesso para usuário: {}", user.getEmail());

            return new ResetPasswordResponse(
                    "Senha redefinida com sucesso. Você já pode fazer login com a nova senha.",
                    true
            );

        } catch (Exception e) {
            log.error("Erro ao redefinir senha", e);
            return new ResetPasswordResponse(
                    "Erro interno do servidor. Tente novamente mais tarde.",
                    false
            );
        }
    }

    /**
     * Limpeza periódica de tokens expirados
     */
    @Transactional
    public void cleanExpiredTokens() {
        try {
            passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());
            log.info("Limpeza de tokens expirados executada com sucesso");
        } catch (Exception e) {
            log.error("Erro ao executar limpeza de tokens expirados", e);
        }
    }
}
