package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "knowledge_areas")
public class KnowledgeArea {
    @Id
    @Column(length = 2)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;
}