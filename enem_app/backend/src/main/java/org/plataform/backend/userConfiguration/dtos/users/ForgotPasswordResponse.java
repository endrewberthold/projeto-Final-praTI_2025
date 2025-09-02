package org.plataform.backend.userConfiguration.dtos.users;

// DTO de resposta para forgot password
public record ForgotPasswordResponse(
        String message,
        boolean success
) {}
