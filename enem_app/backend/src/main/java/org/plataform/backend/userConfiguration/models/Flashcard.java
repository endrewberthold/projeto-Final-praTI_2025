package org.plataform.backend.userConfiguration.models;

import jakarta.persistence.*;
import lombok.*;
import org.plataform.backend.userConfiguration.user.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flashcards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flashcard {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_question", nullable = true) // pode ser null se não for criado a partir de uma questão
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_subject", nullable = false)
    public Subject subject;

    @Id
    @GeneratedValue(strategy =  GenerationType.UUID)
    @Column(name = "id_flashcard", updatable = false,  nullable = false)
    private UUID id;

    @Column(name = "concept", nullable = false, length = 255)
    private String concept;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    
    @Column(name = "create_date", nullable = false)
    private LocalDateTime createDate;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
    }

}