package org.plataform.backend.userConfiguration.dtos.question;


import lombok.*;

/**@author Endrew
 * Este dto envia para o banco as tentativas de resposta do usuário
 * cada linha do banco armazena uma tentativa de resposta das alternativas da questão
 * **/

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptRequestDTO {
    private Long questionId;
    private String presentedId;
    private Integer answerTimeMs;
}