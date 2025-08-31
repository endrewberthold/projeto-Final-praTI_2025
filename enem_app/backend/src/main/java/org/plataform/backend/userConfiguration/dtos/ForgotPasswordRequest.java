package org.plataform.backend.userConfiguration.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// DTO para solicitar recuperação de senha
public record ForgotPasswordRequest(
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email deve ser válido")
        String email
) {}