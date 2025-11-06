package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

import java.util.List;

/**@author Endrew
 * Este dto cria a resposta da questão da sessão, contendo
 * id, texto, img, dificuldade e uma lista de alternativas
 * **/

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

    private Long skillId;
    private String skillCode;
    private String skillDescription;
    private Long competencyId;
    private String competencyDescription;
}
