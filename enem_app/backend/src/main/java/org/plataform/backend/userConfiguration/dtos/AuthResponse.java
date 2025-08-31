package org.plataform.backend.userConfiguration.dtos;


public record AuthResponse(
        String token,
        String tokenType,
        Long expiresIn,
        UserResponse user,
        String message
) {
    // Construtor para login/register com sucesso
    public AuthResponse(String token, String tokenType, Long expiresIn, UserResponse user) {
        this(token, tokenType, expiresIn, user, null);
    }

    // Construtor para apenas mensagem
    public AuthResponse(String message) {
        this(null, null, null, null, message);
    }
}