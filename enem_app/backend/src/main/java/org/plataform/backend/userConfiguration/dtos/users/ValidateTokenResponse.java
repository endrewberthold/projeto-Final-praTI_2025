package org.plataform.backend.userConfiguration.dtos.users;

// DTO de resposta para validação de token
public record ValidateTokenResponse(
        boolean valid,
        String message,
        String userEmail
) {}
