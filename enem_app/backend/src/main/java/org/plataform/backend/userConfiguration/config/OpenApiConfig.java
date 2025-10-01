package org.plataform.backend.userConfiguration.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do OpenAPI / Swagger UI.
 * Observação: usamos a annotation @SecurityScheme (importada),
 * e a classe de modelo io.swagger.v3.oas.models.security.SecurityScheme
 * é referenciada com o nome totalmente qualificado para evitar colisão de nomes.
 */
@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        // Note: usamos a classe de modelo com nome totalmente qualificado para evitar conflito
        io.swagger.v3.oas.models.security.SecurityScheme bearerScheme =
                new io.swagger.v3.oas.models.security.SecurityScheme()
                        .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT");

        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, bearerScheme)
                )
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .info(new Info()
                        .title("Plataform API")
                        .version("1.0")
                        .description("API do projeto — endpoints de auth, sessions, flashcards, questions, attempts")
                        .contact(new Contact().name("Equipe").email("dev@plataform.org"))
                        .license(new License().name("Apache 2.0"))
                );
    }
}
