package org.plataform.backend.userConfiguration.dtos.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
        Boolean isOauthUser,
        String profileImage
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
                user.getIsOauthUser(),
                user.getProfileImage()
        );
    }

    private static String resolveProfileImage(User user) {
        if (user.getProfileImage() != null && !user.getProfileImage().isBlank()) {
            return user.getProfileImage();
        }

        String roleName = (user.getRole() != null) ? user.getRole().name() : "LOCAL";
        if ("ADMIN".equalsIgnoreCase(roleName)) {
            return "admin-default.png";
        }

        return "student-default.png";
    }
}
