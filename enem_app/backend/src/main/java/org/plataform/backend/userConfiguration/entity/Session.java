package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "sessions", schema = "public")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "area_id", nullable = false)
    private String areaId;

    @Column(name = "level_id", nullable = false)
    private Long levelId;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;

    @Column(name = "finished_at")
    private OffsetDateTime finishedAt;

    @Column(name = "presented_mapping", columnDefinition = "text")
    private String presentedMapping;

    @Column(name = "num_questions")
    private Integer numQuestions;

    @Column(name = "abandoned", nullable = false)
    private Boolean abandoned;

}
