package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionFinishResponseDTO {
    private Long sessionId;
    private int totalQuestions;
    private int correct;
    private int wrong;
    private int xpEarned;
    private double avgTimeMs;
    private boolean levelCompleted;
    private List<CompetencySummaryDTO> perCompetency;
    private List<SkillSummaryDTO> perSkill;
    private List<PerQuestionResultDTO> perQuestion;
}
