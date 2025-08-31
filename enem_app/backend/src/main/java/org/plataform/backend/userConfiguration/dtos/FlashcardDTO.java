package org.plataform.backend.userConfiguration.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class FlashcardDTO {

    private UUID id;
    private String concept;
    private String description;
    private LocalDateTime createdDate;
    private Long id_user;
    private UUID subjectId;
    private UUID questionId;

    public FlashcardDTO() {}

}

