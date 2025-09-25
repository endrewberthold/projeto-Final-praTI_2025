package org.plataform.backend.userConfiguration.dtos.question;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

/**@author Endrew
 * Este dto gera a resposta de finalização de uma sessão de perguntas
 * é dividido em três blocos:
 * 1. 'Feedback' da sessão
 * 2. List > contem todas as competencias presentes na sessão
 * 3. List > contem todas as habilidades presentes na sessão
 * 4. List > contem todas as respostas do utilizador na sessão
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Resposta de final de sessão")
public class SessionFinishResponseDTO {

    @Schema(description = "Id da sessão", example = "int")
    private Long sessionId;

    @Schema(description = "Total de Questões", example = "int")
    private int totalQuestions;

    @Schema(description = "Alternativa correta", example = "true")
    private int correct;

    @Schema(description = "Alternativa incorreta", example = "false")
    private int wrong;

    @Schema(description = "Experiência adquirida", example = "int")
    private int xpEarned;

    @Schema(description = "Tempo médio da sesão", example = "MS")
    private double avgTimeMs;

    @Schema(description = "Level completo", example = "Boolean")
    private boolean levelCompleted;

    @Schema(description = "Competencias presentes na sessão", example = "List")
    private List<CompetencySummaryDTO> perCompetency;

    @Schema(description = "Habilidades presentes na sessão", example = "List")
    private List<SkillSummaryDTO> perSkill;

    @Schema(description = "Resposta das questões", example = "List")
    private List<PerQuestionResultDTO> perQuestion;
}