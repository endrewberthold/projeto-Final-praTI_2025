package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

import lombok.*;

@Entity
@Table(
        name = "achievements",
        schema = "public"
)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Achievements {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    @Column(
            name = "user_id",
            nullable = false
    )
    private Long userId;
    @Column(
            name = "skill_id",
            nullable = false
    )
    private Long skillId;
    @Column(
            name = "achieved_at",
            nullable = false
    )
    private OffsetDateTime achievedAt;
}