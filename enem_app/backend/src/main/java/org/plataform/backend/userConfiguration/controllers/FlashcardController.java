package org.plataform.backend.userConfiguration.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardPageDTO;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardRequestDTO;
import org.plataform.backend.userConfiguration.dtos.flashcards.FlashcardResponseDTO;
import org.plataform.backend.userConfiguration.services.FlashcardService;
import org.plataform.backend.userConfiguration.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


/** @author Giovanna
 *Anotações Swagger (ver nomes nos imports)
 ***/
@RestController
@RequestMapping(value="/api/flashcards")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    /** @author Endrew
     *Endpoint para criar o flashcard
     ***/
    @PostMapping()
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
    @GetMapping
    @Operation(
            summary = "Mostrar flashcards",
            description = "Lista os flashcards do usuário autenticado, com paginação, ordenação e filtro por área",
            parameters = {
                    @Parameter(
                            name = "areaId",
                            description = "Filtra os flashcards por área de conhecimento",
                            in = ParameterIn.QUERY
                    ),
                    @Parameter(
                            name = "page",
                            description = "Filtra pelo número da página",
                            in = ParameterIn.QUERY,
                            schema = @Schema(type = "integer")
                    ),
                    @Parameter(
                            name = "size",
                            description = "Define a quantidade de flashcards por página",
                            in = ParameterIn.QUERY,
                            schema = @Schema(type = "integer")
                    ),
                    @Parameter(
                            name = "sort",
                            description = "Define critério de ordenação (id||term||areaId,asc||desc)",
                            in = ParameterIn.QUERY,
                            schema = @Schema(type = "string")
                    )
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Flashcards exibidos para o usuário",
                    content = @Content(
                            schema = @Schema(implementation = FlashcardPageDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados inseridos são inválidos",
                    content = @Content)
    })
    public ResponseEntity<FlashcardPageDTO> getUserFlashcards(
            @AuthenticationPrincipal User principal,
            @RequestParam(required = false) String areaId,
            @Parameter(hidden = true) Pageable pageable
    ) {
        Long userId = principal.getId();
        Page<FlashcardResponseDTO> pageResult = (areaId != null)
                ? flashcardService.getUserFlashcardsByArea(userId, areaId, pageable)
                : flashcardService.getUserFlashcards(userId, pageable);

        /** @author Giovanna
         *Converte Page para FlashcardPageDTO
         ***/
        FlashcardPageDTO dto = FlashcardPageDTO.builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(dto);
    }


    /** @author Endrew
     *Endpoint para editar o flashcard
     ***/
    @PutMapping("/{id}")
    @Operation(summary = "Editar flashcard", description = "Altera o conteúdo do flashcard com base no ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flashcard alterado com sucesso", content = @Content(
                    schema = @Schema(implementation = FlashcardResponseDTO.class)
            )),
            @ApiResponse(responseCode = "400", description = "Flashcard não encontrado",
                    content = @Content)
    })
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
    @Operation(summary = "Deletar flashcard", description = "Apaga flashcards com base no ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Flashcard deletado com sucesso",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Flashcard não encontrado",
                    content = @Content)
    })
    public ResponseEntity<Void> deleteFlashcard(
            @AuthenticationPrincipal User principal,
            @PathVariable Long id
    ) {
        Long userId = principal.getId();
        flashcardService.deleteFlashcard(userId, id);
        return ResponseEntity.noContent().build();
    }
}