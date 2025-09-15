package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionStartResponse {
    private Long sessionId;
    private Long userId;
    private String areaId;
    private Long levelId;
    private OffsetDateTime startedAt;
    private List<SessionQuestionDTO> questions;
}
