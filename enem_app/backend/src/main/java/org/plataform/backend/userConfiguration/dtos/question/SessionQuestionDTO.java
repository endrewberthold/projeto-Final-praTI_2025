package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionQuestionDTO {
    private Long questionId;
    private String text;
    private String imageUrl;
    private Double difficulty;
    private List<PresentedAlternativeDTO> alternatives;
}
