package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

/**@author Endrew
 * Este dto cria a estrutura de requisição do level
 * que o usuário esta acessando
 * sempre será retornado o id, o numero de qustões [5] e a area de conhecimento
 * esta estrutura deve ser utilizada nos componentes após acessar a área de conhecimento
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionStartRequest {
    private Long levelId;
    private Integer numQuestions = 5;
    private String areaId;
}
