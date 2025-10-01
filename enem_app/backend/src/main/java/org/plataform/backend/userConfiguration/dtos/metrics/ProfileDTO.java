package org.plataform.backend.userConfiguration.dtos.metrics;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfileDTO {
    private long totalSessions;
    private double overallAccuracyPct;
    private double avgAnswerTimeMs;
    private long totalXp;
    private Integer currentLevel;
    private AreaStatDTO topArea;
    private List<SkillStatDTO> topSkills;
    private List<CompetencyStatDTO> topCompetencies;
    private long flashcardsCount;
}
