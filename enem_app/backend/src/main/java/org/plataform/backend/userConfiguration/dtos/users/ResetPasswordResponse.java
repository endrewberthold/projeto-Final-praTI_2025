package org.plataform.backend.userConfiguration.dtos.users;

// DTO de resposta para reset password
public record ResetPasswordResponse(
        String message,
        boolean success
) {}
