package org.plataform.backend.userConfiguration.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
            summary = "Inicia sessão",
            description = "Cria sessão com questões randomizadas por área/nível",
            security = @SecurityRequirement(name = "bearerAuth") // adicione se a rota exigir autenticação
    )
    @ApiResponse(
            responseCode = "201",
            description = "Sessão criada",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = SessionStartResponse.class))
    )
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
            summary = "Finaliza sessão",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponse(
            responseCode = "200",
            description = "Sessão finalizada com sucesso",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = SessionFinishResponseDTO.class))
    )
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<SessionFinishResponseDTO> finishSession(
            @AuthenticationPrincipal User principal,
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
