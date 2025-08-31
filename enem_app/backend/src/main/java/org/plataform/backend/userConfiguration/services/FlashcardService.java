package org.plataform.backend.userConfiguration.services;

import org.plataform.backend.userConfiguration.models.Subject;
import org.plataform.backend.userConfiguration.models.Question;
import org.plataform.backend.userConfiguration.dtos.FlashcardDTO;
import org.plataform.backend.userConfiguration.models.Flashcard;
import org.plataform.backend.userConfiguration.repositories.FlashcardRepository;
import org.plataform.backend.userConfiguration.user.User;
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

    public List<Flashcard> getFlashcardsByUser(Long userId) {
        return flashcardRepository.findByUserId(userId);
    }

    public List<Flashcard> getFlashcardsByUserAndSubjectId(Long userId, UUID subjectId) {
        return flashcardRepository.findByUserAndSubject(userId, subjectId);
    }

    public FlashcardDTO toDto(Flashcard flashcard) {
        FlashcardDTO dto = new FlashcardDTO();
        dto.setId(flashcard.getId());
        dto.setConcept(flashcard.getConcept());
        dto.setDescription(flashcard.getDescription());
        dto.setCreatedDate(flashcard.getCreateDate());
        dto.setId_user(flashcard.getUser().getId_user());
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
