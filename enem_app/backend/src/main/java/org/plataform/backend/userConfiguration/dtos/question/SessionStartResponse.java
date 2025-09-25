package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

/**@author Endrew
 * Este dto cria a estrutura de resposta da sessão iniciada
 * aqui estamos armazenando o start_time
 * este dto é responsavel por entregar o id da sessão vinculado ao usuario
 * e a lista de questões, ordenadas aleatoriamente, para serem respondidas
 * **/

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
