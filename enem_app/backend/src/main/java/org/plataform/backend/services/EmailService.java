package org.plataform.backend.services;

import lombok.extern.slf4j.Slf4j;
import org.plataform.backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void sendPasswordResetEmail(User user, String token) {
        String resetUrl = frontendUrl + "/reset-password/" + token;

        String emailContent = String.format(
                "\n" +
                        "===== EMAIL DE RECUPERAÇÃO DE SENHA =====\n" +
                        "Para: %s (%s)\n" +
                        "Assunto: Recuperação de Senha - ENEM App\n\n" +
                        "Olá, %s!\n\n" +
                        "Link de recuperação: %s\n\n" +
                        "Token: %s\n\n" +
                        "Este link é válido por 1 hora.\n" +
                        "==========================================\n",
                user.getEmail(),
                user.getName(),
                user.getName(),
                resetUrl,
                token  // TOKEN VISÍVEL PARA TESTE
        );

        // Exibe no console para desenvolvimento
        log.info(emailContent);

        log.info("✓ Token de recuperação criado com sucesso para: {}", user.getEmail());
        log.info("✓ Para testar, copie o token: {}", token);
    }
}