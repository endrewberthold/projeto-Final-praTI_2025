package org.plataform.backend.userConfiguration.services;

import lombok.extern.slf4j.Slf4j;
import org.plataform.backend.userConfiguration.entity.User;
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
                """
                        
                        ===== EMAIL DE RECUPERAÇÃO DE SENHA =====
                        Para: %s (%s)
                        Assunto: Recuperação de Senha - ENEM App
                        
                        Olá, %s!
                        
                        Link de recuperação: %s
                        
                        Token: %s
                        
                        Este link é válido por 1 hora.
                        ==========================================
                        """,
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