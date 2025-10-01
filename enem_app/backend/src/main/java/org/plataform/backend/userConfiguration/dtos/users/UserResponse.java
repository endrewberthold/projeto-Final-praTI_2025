package org.plataform.backend.userConfiguration.dtos.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import org.plataform.backend.userConfiguration.entity.User;

@JsonIgnoreProperties({"password", "password_hash", "passwordHash", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
public record UserResponse(

        String name,
        String email,
        String role,
        java.time.@jakarta.validation.constraints.NotNull OffsetDateTime createAt,
        Integer xpPoints,
        Integer level,
        String provider,
        Boolean isOauthUser
) {
    public UserResponse(User user) {
        this(
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getXpPoints(),
                user.getLevel(),
                user.getProvider(),
                user.getIsOauthUser()
        );
    }
}
