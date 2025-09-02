package org.plataform.backend.userConfiguration.dtos.flashcards;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class FlashcardDTO {
    Long id;
    Long userId;
    Long areaId;
    String term;
    String description;
    OffsetDateTime createdAt;
    OffsetDateTime updatedAt;
}