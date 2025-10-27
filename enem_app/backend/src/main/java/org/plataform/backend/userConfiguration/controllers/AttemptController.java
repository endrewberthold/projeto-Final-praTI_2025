package org.plataform.backend.userConfiguration.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.Generated;
import org.plataform.backend.userConfiguration.dtos.question.AttemptRequestDTO;
import org.plataform.backend.userConfiguration.dtos.question.AttemptResponseDTO;
import org.plataform.backend.userConfiguration.entity.User;
import org.plataform.backend.userConfiguration.services.AttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions/{sessionId}/attempts")
public class AttemptController {
    private final AttemptService attemptService;

    @PostMapping
    @Operation(
            summary = "Submeter uma tentativa",
            description = "Cria e registra uma nova tentativa de resposta em uma sessão para o usuário autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Tentativa registrada com sucesso",
                    content = @Content(schema = @Schema(implementation = AttemptResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content)
    })
    public ResponseEntity<AttemptResponseDTO> submitAttempt(
            @AuthenticationPrincipal
            @Parameter(hidden = true, description = "Usuário autenticado") User principal,

            @PathVariable
            @Parameter(description = "ID da sessão em que a tentativa será registrada", required = true, example = "1") Long sessionId,

            @RequestBody
            @Parameter(description = "Dados da tentativa a ser submetida", required = true)
            AttemptRequestDTO req) {

        Long userId = principal.getId();
        AttemptResponseDTO resp = this.attemptService.submitAttempt(userId, sessionId, req);
        return ResponseEntity.status(201).body(resp);
    }

    @Generated
    public AttemptController(final AttemptService attemptService) {
        this.attemptService = attemptService;
    }
}
