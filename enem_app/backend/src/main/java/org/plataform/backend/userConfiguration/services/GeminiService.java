package org.plataform.backend.userConfiguration.services;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    private static final String SYSTEM_PROMPT = "Você é um tutor especialista em ENEM. Responda sempre em português do Brasil, com linguagem simples e didática. Estruture a resposta em tópicos curtos com marcadores (\"*\"). Evite reticências e finalize com um pequeno resumo e 2–3 dicas de estudo. Se a pergunta envolver fórmulas ou conceitos de Física/Química/Matemática, forneça um exemplo prático. Mantenha a resposta objetiva e clara.";

    private final Client geminiClient;

    public GeminiService(Client geminiClient) {
        this.geminiClient = geminiClient;
    }

    // Mantém compatibilidade para chamadas antigas
    public String askQuestion(String question) {
        return askQuestion(question, null);
    }

    // Novo método que permite contexto para respostas mais relevantes
    public String askQuestion(String question, String context) {
        try {
            if (question == null || question.trim().isEmpty()) {
                return "Pergunta vazia";
            }

            StringBuilder prompt = new StringBuilder();
            prompt.append(SYSTEM_PROMPT)
                  .append("\n\nPergunta do aluno: \n")
                  .append(question.trim());

            if (context != null && !context.trim().isEmpty()) {
                prompt.append("\n\nContexto adicional (use apenas se ajudar): \n")
                      .append(context.trim());
            }

            prompt.append("\n\nRegras: \n")
                  .append("* Não use reticências.\n")
                  .append("* Use títulos curtos em negrito quando útil.\n")
                  .append("* Limite a resposta a ~1500 caracteres.\n")
                  .append("* Finalize com 'Resumo' e 'Dicas de estudo'.");

            GenerateContentResponse response = geminiClient.models.generateContent(
                    "gemini-2.5-flash",
                    prompt.toString(),
                    null
            );

            String text = response.text();
            if (text == null || text.trim().isEmpty()) {
                logger.warn("Resposta do Gemini veio vazia");
                return "Não obtive resposta da IA.";
            }
            return text;
        } catch (Exception e) {
            logger.error("Erro ao consultar Gemini: {}", e.getMessage(), e);
            return "Erro ao consultar o serviço de IA.";
        }
    }
}
