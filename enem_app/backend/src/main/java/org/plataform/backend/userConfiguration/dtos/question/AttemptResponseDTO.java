package org.plataform.backend.userConfiguration.dtos.question;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptResponseDTO {
    private Long attemptId;
    private Long questionId;
    private boolean correct;
    private int xpEarned;
    private Integer answerTimeMs;
}