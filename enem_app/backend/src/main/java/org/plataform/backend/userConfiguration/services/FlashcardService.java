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

    /**@author Endrew
     * Serviço que verifica se o user existe ao criar o flashcard e se
     * a Área de Conhecimento existe
     * Se True retorna o flashcard criado, se False expõe um Exception
     * **/
    @Transactional
    public FlashcardResponseDTO createFlashcard(Long userId, FlashcardRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        KnowledgeArea area = knowledgeAreaRepository.findById(dto.getAreaId())
                .orElseThrow(() -> new EntityNotFoundException("Área de conhecimento não encontrada"));

        Flashcard flashcard = Flashcard.builder()
                .user(user)
                .area(area)
                .term(dto.getTerm())
                .description(dto.getDescription())
                .build();
        flashcardRepository.save(flashcard);
        return mapToResponseDTO(flashcard);
    }

    /**@author Endrew
     * Gera paginação de todos os flashcards criados pelo user
     * Esta definido com máximo 20 por página
     * Este serviço retorna todos
     * **/
    @Transactional(readOnly = true)
    public Page<FlashcardResponseDTO> getUserFlashcards(Long userId, Pageable pageable) {
        return flashcardRepository.findByUser_Id(userId, pageable)
                .map(this::mapToResponseDTO);
    }

    /**@author Endrew
     * Gera paginação de todos os flashcards criados por Área de conhecimento
     * **/
    @Transactional(readOnly = true)
    public Page<FlashcardResponseDTO> getUserFlashcardsByArea(Long userId, String areaId, Pageable pageable) {
        return flashcardRepository.findByUser_IdAndArea_Id(userId, areaId, pageable)
                .map(this::mapToResponseDTO);
    }

    /**@author Endrew
     * Serviço de update do flashcards, faz verificações de que se o flashcard existe,
     * se a Área de conhecimento foi criada
     * e se o id do flashcard pertence ao user que esta logado
     * **/
    @Transactional
    public FlashcardResponseDTO updateFlashcard(Long userId, Long flashcardId, FlashcardRequestDTO dto) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new EntityNotFoundException("Flashcard não encontrado."));

        if(!flashcard.getUser().getId().equals(userId)) {
            throw new SecurityException("Você não tem permissão para editar este Flashcard.");
        }

        KnowledgeArea area = knowledgeAreaRepository.findById(dto.getAreaId())
                .orElseThrow(() -> new EntityNotFoundException("Área de Conhecimento não encontrada."));

        flashcard.setTerm(dto.getTerm());
        flashcard.setDescription(dto.getDescription());
        flashcard.setArea(area);

        flashcardRepository.save(flashcard);
        return mapToResponseDTO(flashcard);
    }

    /**@author Endrew
     * Serviço de delete do flashcards
     * Fazas mesmas verificações do update
     * **/
    @Transactional
    public void deleteFlashcard(Long userId, Long flashcardId) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new EntityNotFoundException("Flashcard não encontrado."));

        if (!flashcard.getUser().getId().equals(userId)) {
            throw new SecurityException("Você não tem permissão para editar este Flashcard.");
        }

        flashcardRepository.delete(flashcard);
    }

    /**@author Endrew
     * Mapper que build a resposta dos metodos do flashcard
     * **/
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