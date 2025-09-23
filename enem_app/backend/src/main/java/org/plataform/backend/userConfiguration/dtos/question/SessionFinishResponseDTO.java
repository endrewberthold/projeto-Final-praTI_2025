package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

import java.util.List;

/**@author Endrew
 * Este dto gera a resposta de finalização de uma sessão de perguntas
 * é dividido em três blocos:
 * 1. feedback da sessão
 * 2. List > contem todas as competencias presentes na sessão
 * 3. List > contem todas as habilidades presentes na sessão
 * 4. List > contem todas as respostas do usuário na sessão
 * **/

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
