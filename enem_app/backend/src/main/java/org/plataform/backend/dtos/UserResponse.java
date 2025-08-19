package org.plataform.backend.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.plataform.backend.user.User;
import org.plataform.backend.user.UserRole;

import java.util.Date;
import java.util.UUID;

@JsonIgnoreProperties({"password", "password_hash", "passwordHash", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
public record UserResponse(
        UUID uuidUser,
        String name,
        String email,
        String role,
        Date createAt,
        Integer xpPoints,
        Integer level,
        String provider,
        Boolean isOauthUser
) {
    public UserResponse(User user) {
        this(
                user.getUuidUser(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreate_at(),
                user.getXp_points(),
                user.getLevel(),
                user.getProvider(),
                user.getIsOauthUser()
        );
    }
}
