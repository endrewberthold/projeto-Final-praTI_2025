package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionStartRequest {
    private Long levelId;
    private Integer numQuestions = 5;
    private String areaId;
}
