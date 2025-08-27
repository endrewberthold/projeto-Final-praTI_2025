package org.plataform.backend.services;

import org.plataform.backend.models.User;
import org.plataform.backend.models.Subject;
import org.plataform.backend.models.Question;
import org.plataform.backend.dtos.FlashcardDTO;
import org.plataform.backend.models.Flashcard;
import org.plataform.backend.repositories.FlashcardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    public FlashcardService(FlashcardRepository flashcardRepository) {
        this.flashcardRepository = flashcardRepository;
    }

    public Flashcard createFlashcard(Flashcard flashcard) {
        return flashcardRepository.save(flashcard);
    }

    public List<Flashcard> getFlashcardsByUser(UUID userId) {
        return flashcardRepository.findByUserId(userId);
    }

    public List<Flashcard> getFlashcardsByUserAndSubjectId(UUID userId, UUID subjectId) {
        return flashcardRepository.findByUserIdAndSubjectId(userId, subjectId);
    }

    public FlashcardDTO toDto(Flashcard flashcard) {
        FlashcardDTO dto = new FlashcardDTO();
        dto.setId(flashcard.getId());
        dto.setConcept(flashcard.getConcept());
        dto.setDescription(flashcard.getDescription());
        dto.setCreatedDate(flashcard.getCreateDate());
        dto.setUserId(flashcard.getUser().getId());
        dto.setSubjectId(flashcard.getSubject().getId());
        dto.setQuestionId(flashcard.getQuestion() != null ? flashcard.getQuestion().getId() : null);
        return dto;
    }

    public Flashcard toEntity(FlashcardDTO dto, User user, Subject subject, Question question) {

        Flashcard flashcard = new Flashcard();
        flashcard.setId(dto.getId());
        flashcard.setConcept(dto.getConcept());
        flashcard.setDescription(dto.getDescription());
        flashcard.setCreateDate(dto.getCreatedDate());
        flashcard.setUser(user);
        flashcard.setSubject(subject);
        flashcard.setQuestion(question);
        return flashcard;
    }
}
