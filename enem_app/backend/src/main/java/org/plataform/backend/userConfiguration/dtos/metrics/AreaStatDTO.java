package org.plataform.backend.userConfiguration.dtos.metrics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaStatDTO {
    private String areaId;
    private long correctCount;
    private long totalCount;
    private double accuracyPct;
}
