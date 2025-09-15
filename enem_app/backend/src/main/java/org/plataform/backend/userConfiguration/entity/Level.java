package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Table(
        name = "levels",
        schema = "public"
)
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Level {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "min_difficulty", nullable = false, precision = 3, scale = 1)
    private BigDecimal minDifficulty;

    @Column(name = "max_difficulty", nullable = false, precision = 3, scale = 1)
    private BigDecimal maxDifficulty;

}
