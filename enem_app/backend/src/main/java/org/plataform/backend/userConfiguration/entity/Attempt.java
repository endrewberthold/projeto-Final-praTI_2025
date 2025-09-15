package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

import lombok.*;

@Entity
@Table(
        name = "attempts",
        schema = "public"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "alternative_id", nullable = false)
    private Long alternativeId;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @Column(name = "answer_time_ms")
    private Integer answerTimeMs;

    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "presented_mapping", columnDefinition = "text")
    private String presentedMapping;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "xp_earned")
    private Integer xpEarned;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }

        if (this.isCorrect == null) {
            this.isCorrect = false;
        }

    }
}