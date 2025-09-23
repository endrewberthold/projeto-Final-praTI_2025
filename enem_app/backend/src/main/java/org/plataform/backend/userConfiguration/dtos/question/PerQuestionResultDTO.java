package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

/**@author Endrew
 * Este dto cria uma lista com todas as alternativas respondidas pelo usuário
 * e seus status True - False
 * **/

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
