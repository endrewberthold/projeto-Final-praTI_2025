package org.plataform.backend.userConfiguration.dtos;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token é obrigatório")
        String refreshToken
) {}
