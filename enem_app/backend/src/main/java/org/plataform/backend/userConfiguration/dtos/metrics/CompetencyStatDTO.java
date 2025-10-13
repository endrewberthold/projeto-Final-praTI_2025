package org.plataform.backend.userConfiguration.dtos.metrics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetencyStatDTO {
    private Long competencyId;
    private String competencyDescription;
    private long correctCount;
    private long totalCount;
    private double accuracyPct;
}
