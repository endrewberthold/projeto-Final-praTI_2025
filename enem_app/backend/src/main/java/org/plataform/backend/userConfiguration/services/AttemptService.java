package org.plataform.backend.userConfiguration.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.plataform.backend.userConfiguration.dtos.question.AttemptRequestDTO;
import org.plataform.backend.userConfiguration.dtos.question.AttemptResponseDTO;
import org.plataform.backend.userConfiguration.entity.*;
import org.plataform.backend.userConfiguration.exception.BadRequestException;
import org.plataform.backend.userConfiguration.exception.ResourceNotFoundException;
import org.plataform.backend.userConfiguration.repositories.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final SessionRepository sessionRepository;
    private final AlternativeRepository alternativeRepository;
    private final UserRepository userRepository;
    private final LevelRepository levelRepository;
    private final ObjectMapper objectMapper;
    private final SessionService sessionService;

    @Transactional
    public AttemptResponseDTO submitAttempt(Long userId, Long sessionId, AttemptRequestDTO req) {
        // valida sessão
        Session session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão não encontrada"));

        // valida questão
        Question question = questionRepository.findById(req.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Questão não encontrada"));

        // recuperar presented mapping para a questão
        Map<String, List<Map<String, Object>>> mappingFull;
        try {
            mappingFull = objectMapper.readValue(session.getPresentedMapping(),
                    new TypeReference<Map<String, List<Map<String, Object>>>>() {
                    });
        } catch (Exception e) {
            throw new RuntimeException("Erro ao parsear mapping da sessão", e);
        }

        List<Map<String, Object>> alternativesMapping = mappingFull.get(String.valueOf(req.getQuestionId()));
        if (alternativesMapping == null) {
            alternativesMapping = mappingFull.get(req.getQuestionId().toString());
        }
        if (alternativesMapping == null) {
            throw new BadRequestException("Essa questão não pertence à sessão");
        }

        // agora presentedId é obrigatório (conforme seu pedido)
        if (req.getPresentedId() == null) {
            throw new BadRequestException("presentedId é obrigatório");
        }

        // procurar o presentedId no mapping
        Optional<Map<String, Object>> found = alternativesMapping.stream()
                .filter(m -> req.getPresentedId().equals(m.get("presentedId")))
                .findFirst();

        if (found.isEmpty()) {
            throw new BadRequestException("presentedId inválido");
        }

        Number altIdNum = (Number) found.get().get("alternativeId");
        Long chosenAltId = altIdNum.longValue();

        Alternative chosenAlt = alternativeRepository.findById(chosenAltId)
                .orElseThrow(() -> new ResourceNotFoundException("Alternativa selecionada não encontrada"));

        // descobrir alternativa correta (procura no mapping primeiro)
        Optional<Map<String, Object>> correct = alternativesMapping.stream()
                .filter(m -> Boolean.TRUE.equals(m.get("isCorrect")))
                .findFirst();

        if (correct.isEmpty()) {
            // fallback: buscar no DB (corrigido: pegar lista e fazer stream sobre ela)
            Optional<Alternative> altCorrectDb = alternativeRepository.findByQuestionId(question.getId())
                    .stream()
                    .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
                    .findFirst();

            if (altCorrectDb.isEmpty()) {
                throw new RuntimeException("Questão sem alternativa correta configurada");
            }
            correct = Optional.of(Map.of("alternativeId", altCorrectDb.get().getId(), "isCorrect", true));
        }

        Long correctAltId = ((Number) correct.get().get("alternativeId")).longValue();
        boolean isCorrect = correctAltId.equals(chosenAltId);

        // calcular xp
        Level level = levelRepository.findById(session.getLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Level não encontrado"));
        int xpEarned = isCorrect ? sessionService.calculateXp(question.getDifficulty().doubleValue(), level) : 0;

        // persistir attempt (sem usar nome de package completo)
        Attempt attempt = new Attempt();
        attempt.setUserId(userId);
        attempt.setQuestionId(question.getId());
        attempt.setAlternativeId(chosenAltId);
        attempt.setIsCorrect(isCorrect);
        attempt.setAnswerTimeMs(req.getAnswerTimeMs());
        attempt.setSessionId(session.getId());
        // grava mapping desta questão para auditoria
        try {
            String singleMapping = objectMapper.writeValueAsString(alternativesMapping);
            attempt.setPresentedMapping(singleMapping);
        } catch (Exception e) { /* ignore */ }
        attempt.setCreatedAt(java.time.OffsetDateTime.now());
        attempt.setXpEarned(xpEarned);
        attempt = attemptRepository.save(attempt);

        // atualizar XP do usuário (simples, dentro de transação)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (xpEarned > 0) {
            int newXp = Optional.ofNullable(user.getXpPoints()).orElse(0) + xpEarned;
            int levelIncrements = 0;
            while (newXp >= 100) {
                newXp -= 100;
                levelIncrements++;
            }
            user.setXpPoints(newXp);
            if (levelIncrements > 0) {
                user.setLevel(Optional.ofNullable(user.getLevel()).orElse(1) + levelIncrements);
            }
            userRepository.save(user);
        }

        // montar response DTO
        AttemptResponseDTO resp = new AttemptResponseDTO();
        resp.setAttemptId(attempt.getId());
        resp.setQuestionId(attempt.getQuestionId());
        resp.setCorrect(isCorrect);
        resp.setXpEarned(xpEarned);
        resp.setAnswerTimeMs(attempt.getAnswerTimeMs());

        return resp;
    }
}
