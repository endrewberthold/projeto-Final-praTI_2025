package org.plataform.backend.userConfiguration.dtos;

// DTO de resposta para validação de token
public record ValidateTokenResponse(
        boolean valid,
        String message,
        String userEmail
) {}
