package org.plataform.backend.userConfiguration.dtos.flashcards;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**@author Endrew
 * Construtor dos parametros de requisição json do endpoint POST.
 * Este dto faz a requisição no banco para criar
 * e retorna o json com a estrutura do flashcard a partir do
 * FlashcardResponseDTO
 * **/

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardRequestDTO {

    @NotBlank
    private String term;

    @NotNull
    private String areaId;

    @NotBlank
    @Size(max = 400, message = "Description must not exceed 400 characters")
    private String description;
}