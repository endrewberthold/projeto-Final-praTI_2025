package org.plataform.backend.userConfiguration.dtos.question;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptRequestDTO {
    private Long questionId;
    private String presentedId;
    private Integer answerTimeMs;
}