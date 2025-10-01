package org.plataform.backend.userConfiguration.dtos.metrics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetencyStatDTO {
    private Long competencyId;
    private long correctCount;
    private long totalCount;
    private double accuracyPct;
}
