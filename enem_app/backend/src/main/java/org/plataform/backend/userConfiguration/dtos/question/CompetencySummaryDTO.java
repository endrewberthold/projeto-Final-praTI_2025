package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

/**@author Endrew
 * Este dto cria um sumário das competencias contidas na sessão iniciada pelo usuário
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetencySummaryDTO {
    private Long competencyId;
    private String competencyName;
    private int totalQuestions;
    private int correct;
    private int wrong;
    private double accuracyPct;
}