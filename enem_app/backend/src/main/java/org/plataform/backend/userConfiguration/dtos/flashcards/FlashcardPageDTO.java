package org.plataform.backend.userConfiguration.dtos.flashcards;

import lombok.*;
import java.util.List;

/** @author Giovanna
 *DTO para organizar resultado do Page<FlashcardResponseDTO>
 ***/
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardPageDTO {
    private List<FlashcardResponseDTO> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;

}
