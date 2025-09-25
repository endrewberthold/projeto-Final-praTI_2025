package org.plataform.backend.userConfiguration.dtos.flashcards;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;

/**@author Endrew
 * Construtor dos parametros de resposta json do endpoint
 * POST retorna a estrutura do json completa após a criação do flashcard
 *
 * PUT trabalha com term, areaId e description no json, porém o {id} deve estar contido
 * na URL como uma variavel. ex.: http://localhost:8080/api/flashcards/{id}
 *
 * GET retorna a visualização do flashcard -> term, areaId, description
 *
 * DELETE exclui o conteudo a partir da variavel
 * contendo o {id}, ex.: http://localhost:8080/api/flashcards/{id}
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardResponseDTO {

    @Schema(description = "ID único do flashcard", example = "3")
    private Long id;

    @Schema(description = "Termo ou conceito principal do flashcard", example = "Média ponderada")
    private String term;

    @Schema(description = "Descrição ou explicação do conceito", example = "Método de estatística usado quando alguns elementos são mais importantes que outros")
    private String description;

    @Schema(description = "ID único da área de conhecimento", example = "1")
    private String areaId;

    @Schema(description = "Área de conhecimento do flashcard", example = "Matemática e Suas Tecnologias")
    private String areaName;

    @Schema(description = "Data de criação do flashcard", example = "2025-09-24T23:07:08.757Z")
    private OffsetDateTime createdAt;

    @Schema(description = "Data de atualização do flashcard", example = "2025-09-25T23:07:08.757Z")
    private OffsetDateTime updatedAt;
}