package org.plataform.backend.userConfiguration.controllers;

import org.plataform.backend.userConfiguration.dtos.ai.AiQuestionRequest;
import org.plataform.backend.userConfiguration.dtos.ai.AiResponse;
import org.plataform.backend.userConfiguration.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
@Tag(name = "AI Assistant", description = "Assistente de IA minimalista para ENEM")
public class AiController {

    @Autowired
    private GeminiService geminiService;

    // Endpoint de perguntas
    @PostMapping("/ask")
    @Operation(summary = "Fazer pergunta à IA", description = "Permite fazer perguntas sobre ENEM de forma simples")
    public ResponseEntity<AiResponse> askQuestion(@RequestBody AiQuestionRequest request) {
        try {
            if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AiResponse.error("Pergunta não pode estar vazia"));
            }

            String response = geminiService.askQuestion(request.getQuestion(), request.getContext());
            return ResponseEntity.ok(new AiResponse(response));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AiResponse.error("Erro interno do servidor"));
        }
    }

    // Endpoint de verificar Status
    @GetMapping("/health")
    @Operation(summary = "Verificar status da IA", description = "Verifica se o serviço de IA está funcionando")
    public ResponseEntity<AiResponse> healthCheck() {
        try {
            String testResponse = geminiService.askQuestion("Teste de conectividade");
            return ResponseEntity.ok(new AiResponse("Serviço de IA funcionando corretamente"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(AiResponse.error("Serviço de IA indisponível"));
        }
    }
}