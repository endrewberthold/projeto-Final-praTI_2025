package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

/**@author Endrew
 * Este dto cria a estrutura de resposta as alternativas
 * onde as alternativas são ordenadas aleatoriamente dentro de
 * uma lista incremental
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentedAlternativeDTO {
    private String presentedId;
    private Long id;
    private String letter;
    private String text;
}
