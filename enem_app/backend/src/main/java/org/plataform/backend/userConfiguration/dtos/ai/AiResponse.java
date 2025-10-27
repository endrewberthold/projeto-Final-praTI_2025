package org.plataform.backend.userConfiguration.dtos.ai;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

// DTO para retornar respostas da IA
public class AiResponse {
    private String response;
    private boolean success;
    private String error;

    public AiResponse(String response) {
        this.response = response;
        this.success = true;
        this.error = null;
    }

    public static AiResponse error(String errorMessage) {
        AiResponse response = new AiResponse();
        response.setSuccess(false);
        response.setError(errorMessage);
        response.setResponse(null);
        return response;
    }
}