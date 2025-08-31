package org.plataform.backend.userConfiguration.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.plataform.backend.userConfiguration.user.User;

import java.util.Date;

@JsonIgnoreProperties({"password", "password_hash", "passwordHash", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
public record UserResponse(

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
