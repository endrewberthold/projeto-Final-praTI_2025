package org.plataform.backend.userConfiguration.dtos.flashcards;

import lombok.*;

import java.time.OffsetDateTime;

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