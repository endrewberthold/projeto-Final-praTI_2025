package org.plataform.backend.userConfiguration.dtos.ai;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

// DTO para receber perguntas do frontend
public class AiQuestionRequest {
    private String question;
    private String context;
}