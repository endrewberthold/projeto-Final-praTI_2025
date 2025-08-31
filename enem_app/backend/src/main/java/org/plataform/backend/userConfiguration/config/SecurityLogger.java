package org.plataform.backend.userConfiguration.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SecurityLogger {

    private static final Logger logger = LoggerFactory.getLogger(SecurityLogger.class);

    public void logLoginAttempt(String email, boolean success) {
        if (success) {
            logger.info("Login bem-sucedido para o usuário: {}", email);
        } else {
            // ⚠️ NUNCA logar senhas
            logger.warn("Login falhou para o usuário: {}", email);
        }
    }

    public void logRegistration(String email) {
        logger.info("Novo usuário registrado: {}", email);
    }

    public void logPasswordChange(String email) {
        logger.info("Senha alterada para o suário: {}", email);
    }

    // ⚠️ MÉTODO PARA SANITIZAR LOGS
    private String sanitizeForLog(String input) {
        if (input == null) return "null";
        return input.replaceAll("[\r\n\t]", "").substring(0, Math.min(input.length(), 100));
    }
}

