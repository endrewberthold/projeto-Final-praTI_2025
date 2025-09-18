package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

/**@author Endrew
 * Este dto cria a estrutura de resposta do sumário
 * das habilidades contidas na sessão, é utilizado na estrutura de lista
 * da resposta final
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillSummaryDTO {
    private Long skillId;
    private String skillCode;
    private String skillDescription;
    private int totalQuestions;
    private int correct;
    private int wrong;
    private double accuracyPct;
}
