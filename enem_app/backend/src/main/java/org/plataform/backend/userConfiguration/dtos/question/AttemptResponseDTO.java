package org.plataform.backend.userConfiguration.dtos.question;


import lombok.*;

/**@author Endrew
 * Este dto gera a resposta das tentativas do usuário para cada pergunta respondida
 * retornando True - False, e a experiencia adiquirida
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptResponseDTO {
    private Long attemptId;
    private Long questionId;
    private boolean correct;
    private int xpEarned;
    private Integer answerTimeMs;
}