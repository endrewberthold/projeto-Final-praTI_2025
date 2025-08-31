package org.plataform.backend.userConfiguration.dtos;

// DTO de resposta para reset password
public record ResetPasswordResponse(
        String message,
        boolean success
) {}
