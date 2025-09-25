package org.plataform.backend.userConfiguration.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardRequestDTO;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardResponseDTO;
import org.plataform.backend.userConfiguration.services.FlashcardService;
import org.plataform.backend.userConfiguration.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    /** @author Endrew
     *Endpoint para criar o flashcard
     ***/

    @PostMapping()
    @Operation(summary = "Criar flashcard", description = "Cria um novo flashcard para o usuário logado")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Flashcard criado com sucesso")
    })
    public ResponseEntity<FlashcardResponseDTO> createFlashcard(
            @AuthenticationPrincipal User principal,
            @Valid @RequestBody FlashcardRequestDTO dto
    ) {
        Long userId = principal.getId();
        FlashcardResponseDTO created = flashcardService.createFlashcard(userId, dto);
        return ResponseEntity.ok(created);
    }

    /** @author Endrew
     *Endpoint para visualizar o flashcard
     ***/
    @GetMapping()
    public ResponseEntity<Page<FlashcardResponseDTO>> getUserFlashcards(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) String areaId,
            Pageable pageable
    ) {
        Long userId = principal.getId();
        Page<FlashcardResponseDTO> result = (areaId != null)
                ? flashcardService.getUserFlashcardsByArea(userId, areaId, pageable)
                : flashcardService.getUserFlashcards(userId, pageable);

        return ResponseEntity.ok(result);
    }

    /** @author Endrew
     *Endpoint para editar o flashcard
     ***/
    @PutMapping("/{id}")
    public ResponseEntity<FlashcardResponseDTO> updateFlashcard(
            @AuthenticationPrincipal User principal,
            @PathVariable Long id,
            @Valid @RequestBody FlashcardRequestDTO dto
    ) {
        Long userId = principal.getId();
        FlashcardResponseDTO updated = flashcardService.updateFlashcard(userId, id, dto);
        return ResponseEntity.ok(updated);
    }

    /** @author Endrew
     *Endpoint para deletar o flashcard
     ***/
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashcard(
            @AuthenticationPrincipal User principal,
            @PathVariable Long id
    ) {
        Long userId = principal.getId();
        flashcardService.deleteFlashcard(userId, id);
        return ResponseEntity.noContent().build();
    }
}