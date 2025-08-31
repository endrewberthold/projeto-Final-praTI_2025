package org.plataform.backend.userConfiguration.dtos;

// DTO de resposta para forgot password
public record ForgotPasswordResponse(
        String message,
        boolean success
) {}
