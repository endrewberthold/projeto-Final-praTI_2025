package org.plataform.backend.userConfiguration.controllers;

import lombok.Generated;
import org.plataform.backend.userConfiguration.dtos.question.SessionFinishResponseDTO;
import org.plataform.backend.userConfiguration.dtos.question.SessionStartRequest;
import org.plataform.backend.userConfiguration.dtos.question.SessionStartResponse;
import org.plataform.backend.userConfiguration.entity.User;
import org.plataform.backend.userConfiguration.services.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/sessions"})
public class SessionController {
    private final SessionService sessionService;

    @PostMapping({"/start"})
    public ResponseEntity<SessionStartResponse> startSession(@AuthenticationPrincipal User principal, @RequestBody SessionStartRequest request) {
        Long userId = principal.getId();
        SessionStartResponse resp = this.sessionService.createSession(userId, request);
        return ResponseEntity.status(201).body(resp);
    }

    @PostMapping({"/{sessionId}/finish"})
    public ResponseEntity<SessionFinishResponseDTO> finishSession(@AuthenticationPrincipal User principal, @PathVariable Long sessionId) {
        Long userId = principal.getId();
        SessionFinishResponseDTO resp = this.sessionService.finishSession(userId, sessionId);
        return ResponseEntity.ok(resp);
    }

    @Generated
    public SessionController(final SessionService sessionService) {
        this.sessionService = sessionService;
    }
}