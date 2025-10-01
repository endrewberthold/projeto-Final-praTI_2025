package org.plataform.backend.userConfiguration.dtos.metrics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillStatDTO {
    private Long skillId;
    private long correctCount;
    private long totalCount;
    private double accuracyPct;
}
