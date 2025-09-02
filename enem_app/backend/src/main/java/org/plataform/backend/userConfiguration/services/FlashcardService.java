package org.plataform.backend.userConfiguration.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardRequestDTO;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardResponseDTO;
import org.plataform.backend.userConfiguration.entity.Flashcard;
import org.plataform.backend.userConfiguration.entity.KnowledgeArea;
import org.plataform.backend.userConfiguration.entity.User;
import org.plataform.backend.userConfiguration.repositories.FlashcardRepository;
import org.plataform.backend.userConfiguration.repositories.KnowledgeAreaRepository;
import org.plataform.backend.userConfiguration.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final UserRepository userRepository;
    private final KnowledgeAreaRepository knowledgeAreaRepository;

    @Transactional
    public FlashcardResponseDTO createFlashcard(Long userId, FlashcardRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        KnowledgeArea area = knowledgeAreaRepository.findById(dto.getAreaId())
                .orElseThrow(() -> new EntityNotFoundException("Knowledge Area not found"));

        Flashcard flashcard = Flashcard.builder()
                .user(user)
                .area(area)
                .term(dto.getTerm())
                .description(dto.getDescription())
                .build();
        flashcardRepository.save(flashcard);
        return mapToResponseDTO(flashcard);
    }

    @Transactional(readOnly = true)
    public Page<FlashcardResponseDTO> getUserFlashcards(Long userId, Pageable pageable) {
        return flashcardRepository.findByUser_Id(userId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<FlashcardResponseDTO> getUserFlashcardsByArea(Long userId, String areaId, Pageable pageable) {
        return flashcardRepository.findByUser_IdAndArea_Id(userId, areaId, pageable)
                .map(this::mapToResponseDTO);
    }


    @Transactional
    public FlashcardResponseDTO updateFlashcard(Long userId, Long flashcardId, FlashcardRequestDTO dto) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new EntityNotFoundException("Flashcard not found"));

        if(!flashcard.getUser().getId().equals(userId)) {
            throw new SecurityException("You are not allowed to update this flashcard");
        }

        KnowledgeArea area = knowledgeAreaRepository.findById(dto.getAreaId())
                .orElseThrow(() -> new EntityNotFoundException("Knowledge Area not found"));

        flashcard.setTerm(dto.getTerm());
        flashcard.setDescription(dto.getDescription());
        flashcard.setArea(area);

        flashcardRepository.save(flashcard);
        return mapToResponseDTO(flashcard);
    }

    @Transactional
    public void deleteFlashcard(Long userId, Long flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new EntityNotFoundException("Flashcard not found"));

        if (!flashcard.getUser().getId().equals(userId)) {
            throw new SecurityException("You are not allowed to delete this flashcard");
        }

        flashcardRepository.delete(flashcard);
    }

    private FlashcardResponseDTO mapToResponseDTO(Flashcard flashcard) {
        return FlashcardResponseDTO.builder()
                .id(flashcard.getId())
                .term(flashcard.getTerm())
                .description(flashcard.getDescription())
                .areaId(flashcard.getArea().getId())
                .areaName(flashcard.getArea().getName())
                .createdAt(flashcard.getCreatedAt())
                .updatedAt(flashcard.getUpdatedAt())
                .build();
    }
}