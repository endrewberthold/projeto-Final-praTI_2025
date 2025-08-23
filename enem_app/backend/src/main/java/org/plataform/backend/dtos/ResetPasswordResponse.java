package org.plataform.backend.dtos;

// DTO de resposta para reset password
public record ResetPasswordResponse(
        String message,
        boolean success
) {}
