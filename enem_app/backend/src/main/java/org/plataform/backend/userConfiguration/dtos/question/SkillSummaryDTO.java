package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

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
