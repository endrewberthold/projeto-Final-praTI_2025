package org.plataform.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO para redefinir senha
public record ResetPasswordRequest(
        @NotBlank(message = "Token é obrigatório")
        String token,

        @NotBlank(message = "Nova senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
        String newPassword,

        @NotBlank(message = "Confirmação de senha é obrigatória")
        String confirmPassword
) {
    // Validação customizada para confirmar senhas iguais
    public boolean passwordsMatch() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}
