package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

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