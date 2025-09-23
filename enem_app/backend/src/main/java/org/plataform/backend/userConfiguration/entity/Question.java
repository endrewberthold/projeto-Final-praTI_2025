package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "questions", schema = "public")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "area_id", length = 2, nullable = false)
    private String areaId;

    @Column(name = "competency_id")
    private Long competencyId;

    @Column(name = "skill_id")
    private Long skillId;

    @Column(name = "year")
    private Integer year;

    @Column(name = "text", columnDefinition = "text", nullable = false)
    private String text;

    @Column(name = "image_url", columnDefinition = "text")
    private String imageUrl;

    @Column(name = "difficulty", precision = 3, scale = 1)
    private BigDecimal difficulty;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Mapeamento bidirecional — mappedBy corresponde ao campo "question" na entidade Alternative
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Alternative> alternatives = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = OffsetDateTime.now();
        if (this.updatedAt == null) this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
