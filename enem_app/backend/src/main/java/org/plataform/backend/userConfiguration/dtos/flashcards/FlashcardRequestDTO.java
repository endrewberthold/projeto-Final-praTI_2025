package org.plataform.backend.userConfiguration.dtos.flashcards;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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
