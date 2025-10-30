package org.plataform.backend.userConfiguration.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.Generated;
import org.plataform.backend.userConfiguration.dtos.question.SessionFinishResponseDTO;
import org.plataform.backend.userConfiguration.dtos.question.SessionStartRequest;
import org.plataform.backend.userConfiguration.dtos.question.SessionStartResponse;
import org.plataform.backend.userConfiguration.entity.User;
import org.plataform.backend.userConfiguration.services.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pelas operações de sessão de questões.
 */
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    /**@author Endrew
     * endpoint utilizado para iniciar uma sessão de perguntas
     * todas as sessões contem um id, numero de questoes [5], e o horario de inicio da sessão
     * **/
    @Operation(
            summary = "Iniciar sessão de perguntas",
            description = "Cria uma nova sessão com questões randomizadas por área e nível",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Sessão criada com sucesso",
                    content = @Content(
            schema = @Schema(implementation = SessionStartResponse.class)
    )                   ),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    })
    @PostMapping("/start")
    public ResponseEntity<SessionStartResponse> startSession(
            @AuthenticationPrincipal User principal,
            @RequestBody SessionStartRequest request
    ) {
        Long userId = principal.getId();
        SessionStartResponse resp = this.sessionService.createSession(userId, request);
        return ResponseEntity.status(201).body(resp);
    }

    /**@author Endrew
     * endpoint para finalizar a sessão de perguntas
     * retorna uma estrutura com feedback da sessão
     * quais competencias estavam sendo avaliadas nesta sessão
     * e quais habilidades
     * **/
    @Operation(
            summary = "Finalizar sessão",
            description = "Finaliza uma sessão de perguntas existente e retorna feedback detalhado.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sessão finalizada com sucesso", content = @Content(
                    schema = @Schema(implementation = SessionFinishResponseDTO.class)
            )                   ),
            @ApiResponse(responseCode = "404", description = "Sessão não encontrada", content = @Content)
    })
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<SessionFinishResponseDTO> finishSession(
            @AuthenticationPrincipal User principal,
            @Parameter(description = "ID da sessão a ser finalizada")
            @PathVariable Long sessionId
    ) {
        Long userId = principal.getId();
        SessionFinishResponseDTO resp = this.sessionService.finishSession(userId, sessionId);
        return ResponseEntity.ok(resp);
    }

    @Generated
    public SessionController(final SessionService sessionService) {
        this.sessionService = sessionService;
    }
}
