package org.plataform.backend.userConfiguration.dtos.flashcards;

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

    private Long id;
    private String term;
    private String description;
    private String areaId;
    private String areaName;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}