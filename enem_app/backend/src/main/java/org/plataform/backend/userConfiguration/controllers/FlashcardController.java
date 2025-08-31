package org.plataform.backend.userConfiguration.controllers;

import org.plataform.backend.userConfiguration.dtos.FlashcardDTO;
import org.plataform.backend.userConfiguration.models.Flashcard;
import org.plataform.backend.userConfiguration.services.FlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @PostMapping
    public ResponseEntity<Flashcard> createFlashcard(@RequestBody Flashcard flashcard) {
        Flashcard created = flashcardService.createFlashcard(flashcard);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FlashcardDTO>> getFlashcardsByUser(@PathVariable Long userId) {
        List<Flashcard> flashcards = flashcardService.getFlashcardsByUser(userId);
        List<FlashcardDTO> dtos = flashcards.stream()
                .map(flashcardService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/user/{userId}/subject/{subjectId}")
    public ResponseEntity<List<FlashcardDTO>> getFlashcardsByUserAndSubject(
            @PathVariable Long userId,
            @PathVariable UUID subjectId
    ) {
        List<Flashcard> flashcards = flashcardService.getFlashcardsByUserAndSubjectId(userId, subjectId);
        List<FlashcardDTO> dtos = flashcards.stream()
                .map(flashcardService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
