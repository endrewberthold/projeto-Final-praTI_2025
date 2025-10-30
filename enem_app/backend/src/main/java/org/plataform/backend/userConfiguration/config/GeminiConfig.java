package org.plataform.backend.userConfiguration.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class GeminiConfig {

    private static final Logger logger = LoggerFactory.getLogger(GeminiConfig.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public Client geminiClient() {
        logger.info("Configurando cliente Gemini com API key: {}...",
                apiKey != null && !apiKey.isEmpty() ? apiKey.substring(0, Math.min(10, apiKey.length())) + "..." : "VAZIA");

        if (apiKey == null || apiKey.trim().isEmpty() || "your-gemini-api-key-here".equals(apiKey)) {
            logger.error("API key do Gemini não configurada corretamente. Valor atual: {}", apiKey);
            throw new IllegalStateException("API key do Gemini não configurada. Configure a variável GEMINI_API_KEY.");
        }

        try {
            Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();
            logger.info("Cliente Gemini configurado com sucesso");
            return client;
        } catch (Exception e) {
            logger.error("Erro ao configurar cliente Gemini: {}", e.getMessage(), e);
            throw e;
        }
    }
}