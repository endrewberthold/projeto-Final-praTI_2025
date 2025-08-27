package org.plataform.backend.repositories;

import org.plataform.backend.models.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FlashcardRepository extends JpaRepository<Flashcard, UUID> {

    //busca flashcards de um user
    List<Flashcard> findByUserId(UUID userId);

    //TODO buscar flashcards de um user por matéria, precisa ser implementado um filter
    List<Flashcard> findByUserIdAndSubjectId(UUID userId, UUID subjectId);

}