package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.OffsetDateTime;

@Table(
        name = "user_levels",
        schema = "public"
)
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "area_id", nullable = false)
    private String areaId;

    @Column(name = "level_id", nullable = false)
    private Long levelId;

    @Column(name = "completed")
    private Boolean completed;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

}
