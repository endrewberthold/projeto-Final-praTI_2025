package org.plataform.backend.userConfiguration.dtos.users;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn
) {}
