package org.plataform.backend.dtos;

// DTO de resposta para validação de token
public record ValidateTokenResponse(
        boolean valid,
        String message,
        String userEmail
) {}
