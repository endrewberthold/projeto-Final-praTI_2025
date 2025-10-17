package org.plataform.backend.userConfiguration.dtos.ai;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

// DTO para solicitar explicações de questões do ENEM
public class AiExplanationRequest {
    private String question;
    private String correctAnswer;
    private String explanation;
}