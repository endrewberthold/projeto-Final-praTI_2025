package org.plataform.backend.userConfiguration.dtos.users;

import org.plataform.backend.userConfiguration.dtos.metrics.ProfileDTO;

public record ProfileResponse(
        UserResponse user,
        ProfileDTO metrics
) {
    public ProfileResponse(UserResponse user, ProfileDTO metrics) {
        this.user = user;
        this.metrics = metrics;
    }
}