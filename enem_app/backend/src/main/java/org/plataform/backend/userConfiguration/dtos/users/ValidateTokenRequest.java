package org.plataform.backend.userConfiguration.dtos.users;

import jakarta.validation.constraints.NotBlank;

// DTO para validar token
public record ValidateTokenRequest(
        @NotBlank(message = "Token é obrigatório")
        String token
) {}
