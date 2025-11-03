package org.plataform.backend.userConfiguration.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.plataform.backend.userConfiguration.dtos.question.*;
import org.plataform.backend.userConfiguration.entity.*;
import org.plataform.backend.userConfiguration.exception.BadRequestException;
import org.plataform.backend.userConfiguration.exception.ResourceNotFoundException;
import org.plataform.backend.userConfiguration.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final QuestionRepository questionRepository;
    private final AlternativeRepository alternativeRepository;
    private final LevelRepository levelRepository;
    private final SessionRepository sessionRepository;
    private final UserLevelRepository userLevelRepository;
    private final AttemptRepository attemptRepository;
    private final ObjectMapper objectMapper;
    private final CompetencyRepository competencyRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    // XP config (constantes)
    private static final int MIN_XP = 5;
    private static final int MAX_XP = 20;

    /**
     * Cria uma sessão: seleciona questões, embaralha alternativas,
     * cria mapping apresentado (presentedId -> alternativeId + text + isCorrect)
     * e grava o mapping na sessão.
     */
    @Transactional
    public SessionStartResponse createSession(Long userId, SessionStartRequest request) {
        if (request.getAreaId() == null || request.getLevelId() == null) {
            throw new BadRequestException("Área de Conhecimento e levelId são obrigatórios");
        }

        Level level = levelRepository.findById(request.getLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Level não encontrado"));

        int numQuestions = Optional.ofNullable(request.getNumQuestions()).orElse(5);
        Random rnd = new Random();

        // buscar questões com query nativa randomizada
        List<Question> questions = questionRepository.selectByAreaAndDifficultyRangeRandom(
                request.getAreaId(),
                level.getMinDifficulty().doubleValue(),
                level.getMaxDifficulty().doubleValue(),
                numQuestions
        );

        if (questions == null || questions.isEmpty()) {
            throw new BadRequestException("Não há questões para os parâmetros informados");
        }

        // criar sessão
        Session session = new Session();
        session.setUserId(userId);
        session.setAreaId(request.getAreaId());
        session.setLevelId(request.getLevelId());
        session.setNumQuestions(numQuestions);
        session.setAbandoned(false);
        session.setStartedAt(OffsetDateTime.now());
        session = sessionRepository.save(session); // gera id

        Set<Long> skillIds = new LinkedHashSet<>();
        Set<Long> competencyIds = new LinkedHashSet<>();
        for (Question q : questions) {
            if (q.getSkillId() != null) skillIds.add(q.getSkillId());
            if (q.getCompetencyId() != null) competencyIds.add(q.getCompetencyId());
        }

        Map<Long, Skill> skillMap = new HashMap<>();
        if (!skillIds.isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(new ArrayList<>(skillIds));
            for (Skill s : skills) skillMap.put(s.getId(), s);
        }

        Map<Long, Competency> competencyMap = new HashMap<>();
        if (!competencyIds.isEmpty()) {
            List<Competency> comps = competencyRepository.findAllById(new ArrayList<>(competencyIds));
            for (Competency c : comps) competencyMap.put(c.getId(), c);
        }

        List<SessionQuestionDTO> dtoQuestions = new ArrayList<>();
        // mapping: questionId -> List<{presentedId, alternativeId, text, isCorrect}>
        Map<Long, List<Map<String, Object>>> sessionMapping = new LinkedHashMap<>();

        //itera sobre todas as alternativas relacionadas a questão que será entregue ao usuário
        for (Question q : questions) {
            List<Alternative> alts = alternativeRepository.findByQuestionId(q.getId());
            if (alts == null) alts = Collections.emptyList();
            Collections.shuffle(alts, rnd);

            //Configura o presentedId com pid: a e constroi a resposta do dto
            List<PresentedAlternativeDTO> presented = new ArrayList<>();
            List<Map<String, Object>> mapAlts = new ArrayList<>();
            int i = 0;
            for (Alternative a : alts) {
                String pid = "a" + (++i);
                PresentedAlternativeDTO pa = PresentedAlternativeDTO.builder()
                        .presentedId(pid)
                        .id(a.getId())
                        .letter(a.getLetter())
                        .text(a.getText())
                        .build();
                presented.add(pa);

                Map<String, Object> m = new HashMap<>();
                m.put("presentedId", pid);
                m.put("alternativeId", a.getId());
                m.put("text", a.getText());
                m.put("isCorrect", Boolean.TRUE.equals(a.getIsCorrect()));
                mapAlts.add(m);
            }

            //construtor da questão
            SessionQuestionDTO sq = SessionQuestionDTO.builder()
                    .questionId(q.getId())
                    .text(q.getText())
                    .imageUrl(q.getImageUrl())
                    .difficulty(q.getDifficulty() != null ? q.getDifficulty().doubleValue() : 0.0)
                    .alternatives(presented)
                    .skillId(q.getSkillId())
                    .skillCode(skillMap.get(q.getSkillId()) != null ? skillMap.get(q.getSkillId()).getCode() : null)
                    .skillDescription(skillMap.get(q.getSkillId()) != null ? skillMap.get(q.getSkillId()).getDescription() : null)
                    .competencyId(q.getCompetencyId())
                    .competencyDescription(competencyMap.get(q.getCompetencyId()) != null ? competencyMap.get(q.getCompetencyId()).getDescription() : null)
                    .build();

            dtoQuestions.add(sq);
            sessionMapping.put(q.getId(), mapAlts);
        }

        //Tratamento de erros de serialização do mapping
        try {
            String mappingJson = objectMapper.writeValueAsString(sessionMapping);
            session.setPresentedMapping(mappingJson);
            sessionRepository.save(session);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao serializar presented mapping da sessão", e);
        }

        return SessionStartResponse.builder()
                .sessionId(session.getId())
                .userId(userId)
                .areaId(session.getAreaId())
                .levelId(session.getLevelId())
                .startedAt(session.getStartedAt())
                .questions(dtoQuestions)
                .build();
    }

    /**
     * Calcula XP com base na dificuldade da questão e nos limites do level.
     * Retorna inteiro arredondado.
     */
    public int calculateXp(double difficulty, Level level) {
        if (level == null || level.getMinDifficulty() == null || level.getMaxDifficulty() == null) {
            return MIN_XP;
        }
        double minDiff = level.getMinDifficulty().doubleValue();
        double maxDiff = level.getMaxDifficulty().doubleValue();
        if (maxDiff == minDiff) return MIN_XP;
        double norm = (difficulty - minDiff) / (maxDiff - minDiff);
        norm = Math.max(0.0, Math.min(1.0, norm));
        double xp = MIN_XP + norm * (MAX_XP - MIN_XP);
        return (int) Math.round(xp);
    }

    public Object getMappingForQuestion(Session session, Long questionId) {
        if (session == null || session.getPresentedMapping() == null) return null;
        try {
            Map<String, List<Map<String, Object>>> mapping = objectMapper.readValue(
                    session.getPresentedMapping(),
                    Map.class
            );
            // JSON keys
            return mapping.get(String.valueOf(questionId));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao desserializar presented mapping da sessão", e);
        }
    }

    /**
     * Finaliza a sessão: agrega attempts, soma XP, decide se nível foi completado,
     * marca user_levels, atualiza XP acumulado do usuário e level global.
     */
    @Transactional
    public SessionFinishResponseDTO finishSession(Long userId, Long sessionId) {
        Session session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão não encontrada"));

        List<Attempt> attempts = attemptRepository.findBySessionId(sessionId);
        if (attempts == null || attempts.isEmpty()) {
            throw new BadRequestException("Sessão sem tentativas");
        }

        final int total = attempts.size();
        final int correct = (int) attempts.stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
                .count();
        final int wrong = total - correct;

        //Verifica se a sessão foi totalmente respondida
        Integer expected = session.getNumQuestions();
        boolean wasFullyAnswered = (expected != null) && (attempts.size() >= expected);

        // soma xp
        int xpSum = 0;
        for (Attempt at : attempts) {
            Integer xp = at.getXpEarned();
            if (xp != null) {
                xpSum += xp;
            } else {
                Question q = questionRepository.findById(at.getQuestionId()).orElse(null);
                Level lvl = (session.getLevelId() != null) ? levelRepository.findById(session.getLevelId()).orElse(null) : null;
                if (q != null && lvl != null && q.getDifficulty() != null) {
                    xpSum += calculateXp(q.getDifficulty().doubleValue(), lvl);
                }
            }
        }

        //tempo médio por questão (ms)
        double avgTimeMs = attempts.stream()
                .filter(a -> a.getAnswerTimeMs() != null)
                .mapToInt(Attempt::getAnswerTimeMs)
                .average()
                .orElse(0.0);

        //decide se nível foi completado (threshold configurável)
        final double completionThreshold = 0.7;
        boolean meetsAccuracy = ((double) correct / (double) total) >= completionThreshold;
        boolean levelCompleted = wasFullyAnswered && meetsAccuracy;

        //caso a sessão não foi totalmente respondida, marca como abandonado
        session.setAbandoned(!wasFullyAnswered);

        // Atualizar XP acumulado do usuário
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        int currentXp = Optional.ofNullable(user.getXpPoints()).orElse(0);
        user.setXpPoints(currentXp + xpSum);

        // Atualiza o level do usuário com base no XP acumulado
        int newLevel = (user.getXpPoints() / 100) + 1; // Level 1: 0-99 XP
        if (user.getLevel() == null || user.getLevel() < newLevel) {
            user.setLevel(newLevel);
        }

        userRepository.save(user);

        // marca user_level atual como completed ou cria se não existir
        String areaId = session.getAreaId();
        Long levelId = session.getLevelId();

        if (levelCompleted){
            Optional<UserLevel> maybeUl = userLevelRepository.findByUserIdAndAreaIdAndLevelId(userId, areaId, levelId);
            if (maybeUl.isPresent()) {
                UserLevel ul = maybeUl.get();
                ul.setCompleted(true);
                ul.setCompletedAt(OffsetDateTime.now());
                userLevelRepository.save(ul);
            } else {
                UserLevel ulNew = new UserLevel();
                ulNew.setUserId(userId);
                ulNew.setAreaId(areaId);
                ulNew.setLevelId(levelId);
                ulNew.setCompleted(true);
                ulNew.setCompletedAt(OffsetDateTime.now());
                userLevelRepository.save(ulNew);
            }

            // criar próximo nível desbloqueado
            Optional<Level> nextLevelOpt = levelRepository.findAll().stream()
                    .filter(l -> l.getId() != null && levelId != null && l.getId() > levelId)
                    .min(Comparator.comparing(Level::getId));
            if (nextLevelOpt.isPresent()) {
                Long nextLevelId = nextLevelOpt.get().getId();
                Optional<UserLevel> maybeNext = userLevelRepository.findByUserIdAndAreaIdAndLevelId(userId, areaId, nextLevelId);
                if (maybeNext.isEmpty()) {
                    UserLevel next = new UserLevel();
                    next.setUserId(userId);
                    next.setAreaId(areaId);
                    next.setLevelId(nextLevelId);
                    next.setCompleted(false);
                    userLevelRepository.save(next);
                }
            }
        }
        // finalizar sessão
        session.setFinishedAt(OffsetDateTime.now());
        sessionRepository.save(session);

        // montar per-question results
        List<PerQuestionResultDTO> perQuestion = attempts.stream().map(at -> {
            int xpForAttempt = Optional.ofNullable(at.getXpEarned()).orElse(0);
            if (xpForAttempt == 0) {
                Question q = questionRepository.findById(at.getQuestionId()).orElse(null);
                Level lvl = (session.getLevelId() != null) ? levelRepository.findById(session.getLevelId()).orElse(null) : null;
                if (q != null && lvl != null && q.getDifficulty() != null) {
                    xpForAttempt = calculateXp(q.getDifficulty().doubleValue(), lvl);
                }
            }

            return PerQuestionResultDTO.builder()
                    .questionId(at.getQuestionId())
                    .isCorrect(Boolean.TRUE.equals(at.getIsCorrect()))
                    .answerTimeMs(at.getAnswerTimeMs())
                    .xpEarned(xpForAttempt)
                    .build();
        }).collect(Collectors.toList());

        // Agregações por Competency e por Skill (apenas métricas descritivas)
        // Carrega todas as questões em batch para evitar N+1
        Set<Long> questionIds = attempts.stream().map(Attempt::getQuestionId).collect(Collectors.toSet());
        List<Question> questions = questionRepository.findAllById(questionIds);
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        // Map<competencyId, int[total, correct, wrong]>
        Map<Long, int[]> compMap = new HashMap<>();
        // Map<skillId, int[total, correct, wrong]>
        Map<Long, int[]> skillMap = new HashMap<>();

        for (Attempt at : attempts) {
            Question q = questionMap.get(at.getQuestionId());
            if (q == null) continue;

            Long compId = q.getCompetencyId();
            if (compId != null) {
                int[] stats = compMap.computeIfAbsent(compId, k -> new int[3]);
                stats[0]++; // total
                if (Boolean.TRUE.equals(at.getIsCorrect())) stats[1]++; // correct
                else stats[2]++; // wrong
            }

            Long skillId = q.getSkillId();
            if (skillId != null) {
                int[] sstats = skillMap.computeIfAbsent(skillId, k -> new int[3]);
                sstats[0]++; // total
                if (Boolean.TRUE.equals(at.getIsCorrect())) sstats[1]++; // correct
                else sstats[2]++; // wrong
            }
        }

        //Busca em batch para preencher nomes/códigos
        Map<Long, String> competencyNames;
        if (!compMap.isEmpty()) {
            Set<Long> compIds = compMap.keySet();
            List<Competency> comps = competencyRepository.findAllById(compIds);
            competencyNames = comps.stream()
                    .filter(Objects::nonNull)
                    .filter(c -> c.getId() != null)
                    .collect(Collectors.toMap(Competency::getId, Competency::getDescription));
        } else {
            competencyNames = new HashMap<>();
        }

        Map<Long, Skill> skillById;
        if (!skillMap.isEmpty()) {
            Set<Long> sIds = skillMap.keySet();
            List<Skill> skills = skillRepository.findAllById(sIds);
            skillById = skills.stream()
                    .filter(Objects::nonNull)
                    .filter(s -> s.getId() != null)
                    .collect(Collectors.toMap(Skill::getId, s -> s));
        } else {
            skillById = new HashMap<>();
        }

        // Construir listas DTO (campos adicionais como nome/codigo/descrição preenchidos)
        List<CompetencySummaryDTO> perCompetency = compMap.entrySet().stream().map(e -> {
            final Long cid = e.getKey();
            int[] st = e.getValue();
            int tot = st[0];
            int corr = st[1];
            int wr = st[2];
            double accuracy = tot > 0 ? ((double) corr * 100.0) / tot : 0.0;

            return CompetencySummaryDTO.builder()
                    .competencyId(cid)
                    .competencyName(competencyNames.get(cid)) // preenchido via repository
                    .totalQuestions(tot)
                    .correct(corr)
                    .wrong(wr)
                    .accuracyPct(accuracy)
                    .build();
        }).collect(Collectors.toList());

        List<SkillSummaryDTO> perSkill = skillMap.entrySet().stream().map(e -> {
            final Long sid = e.getKey();
            int[] st = e.getValue();
            int tot = st[0];
            int corr = st[1];
            int wr = st[2];
            double accuracy = tot > 0 ? ((double) corr * 100.0) / tot : 0.0;

            Skill sk = skillById.get(sid);
            String code = sk != null ? sk.getCode() : null;
            String desc = sk != null ? sk.getDescription() : null;

            return SkillSummaryDTO.builder()
                    .skillId(sid)
                    .skillCode(code) // preenchido via repository
                    .skillDescription(desc)
                    .totalQuestions(tot)
                    .correct(corr)
                    .wrong(wr)
                    .accuracyPct(accuracy)
                    .build();
        }).collect(Collectors.toList());

        // construir resposta final
        return SessionFinishResponseDTO.builder()
                .sessionId(sessionId)
                .totalQuestions(total)
                .correct(correct)
                .wrong(wrong)
                .xpEarned(xpSum)
                .avgTimeMs(avgTimeMs)
                .levelCompleted(levelCompleted)
                .perCompetency(perCompetency)
                .perSkill(perSkill)
                .perQuestion(perQuestion)
                .abandoned(!wasFullyAnswered)
                .build();
    }
}
