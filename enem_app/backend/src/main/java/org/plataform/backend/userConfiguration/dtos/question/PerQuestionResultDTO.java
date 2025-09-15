package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerQuestionResultDTO {
    private Long questionId;
    private boolean isCorrect;
    private Integer answerTimeMs;
    private int xpEarned;
}
