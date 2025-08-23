package org.plataform.backend.dtos;

// DTO de resposta para forgot password
public record ForgotPasswordResponse(
        String message,
        boolean success
) {}
