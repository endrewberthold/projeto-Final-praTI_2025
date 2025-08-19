package org.plataform.backend.dtos;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn
) {}
