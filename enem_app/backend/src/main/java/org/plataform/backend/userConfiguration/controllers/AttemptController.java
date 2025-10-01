package org.plataform.backend.userConfiguration.controllers;

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
@RequestMapping({"/api/sessions/{sessionId}/attempts"})
public class AttemptController {
    private final AttemptService attemptService;


    @PostMapping
    public ResponseEntity<AttemptResponseDTO> submitAttempt(@AuthenticationPrincipal User principal, @PathVariable Long sessionId, @RequestBody AttemptRequestDTO req) {
        Long userId = principal.getId();
        AttemptResponseDTO resp = this.attemptService.submitAttempt(userId, sessionId, req);
        return ResponseEntity.status(201).body(resp);
    }

    @Generated
    public AttemptController(final AttemptService attemptService) {
        this.attemptService = attemptService;
    }
}