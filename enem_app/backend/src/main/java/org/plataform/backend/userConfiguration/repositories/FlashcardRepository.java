package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.models.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, UUID> {

    // Busca todos os flashcards de um usuário pelo id_user
    @Query("SELECT f FROM Flashcard f WHERE f.user.id_user = :userId")
    List<Flashcard> findByUserId(@Param("userId") Long userId);

    // Busca todos os flashcards de um usuário e de um subject específico
    @Query("SELECT f FROM Flashcard f WHERE f.user.id_user = :userId AND f.subject.id = :subjectId")
    List<Flashcard> findByUserAndSubject(
            @Param("userId") Long userId,
            @Param("subjectId") UUID subjectId
    );

    // Busca por subject
    List<Flashcard> findBySubject_Id(UUID subjectId);
}
