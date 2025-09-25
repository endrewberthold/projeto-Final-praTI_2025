package org.plataform.backend.userConfiguration.dtos.flashcards;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "Termo ou conceito principal do flashcard", example = "Média ponderada")
    private String term;

    @Schema(description = "Área de conhecimento do flashcard", example = "Matemática e Suas Tecnologias")
    @NotNull
    private String areaId;

    @NotBlank
    @Schema(description = "Descrição ou explicação do conceito", example = "Método de estatística usado quando alguns elementos são mais importantes que outros")
    @Size(max = 400, message = "Description must not exceed 400 characters")
    private String description;
}