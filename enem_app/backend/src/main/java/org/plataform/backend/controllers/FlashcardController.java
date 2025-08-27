package org.plataform.backend.controllers;

import org.plataform.backend.dtos.FlashcardDTO;
import org.plataform.backend.models.Flashcard;
import org.plataform.backend.services.FlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

//TODO adicionar validações @Valid @NotNull e @Size nos controllers e nos DTOs

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
    public ResponseEntity<List<FlashcardDTO>> getFlashcardsByUser(@PathVariable UUID userId) {
        List<Flashcard> flashcards = flashcardService.getFlashcardsByUser(userId);
        List<FlashcardDTO> dtos = flashcards.stream()
                .map(flashcardService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
