package org.plataform.backend.userConfiguration.dtos;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn
) {}
