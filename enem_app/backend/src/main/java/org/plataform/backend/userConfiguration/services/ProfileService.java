package org.plataform.backend.userConfiguration.services;

import lombok.RequiredArgsConstructor;
import org.plataform.backend.userConfiguration.dtos.metrics.AreaStatDTO;
import org.plataform.backend.userConfiguration.dtos.metrics.CompetencyStatDTO;
import org.plataform.backend.userConfiguration.dtos.metrics.ProfileDTO;
import org.plataform.backend.userConfiguration.dtos.metrics.SkillStatDTO;
import org.plataform.backend.userConfiguration.entity.User;
import org.plataform.backend.userConfiguration.repositories.AttemptRepository;
import org.plataform.backend.userConfiguration.repositories.FlashcardRepository;
import org.plataform.backend.userConfiguration.repositories.SessionRepository;
import org.plataform.backend.userConfiguration.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final FlashcardRepository flashcardRepository;
    private final AttemptRepository attemptRepository;

    public ProfileDTO getProfileForUser(Long userId) {
        long totalSessions = sessionRepository.countByUserId(userId);
        long totalAttempts = attemptRepository.countByUserId(userId);
        long totalCorrect = attemptRepository.countCorrectByUserId(userId);

        double overallAccuracyPct = 0.0;
        if (totalSessions > 0) {
            overallAccuracyPct = ((double) totalSessions / totalCorrect) * 100.0;
        }

        Double avfAnswerTimeObj = attemptRepository.averageAnswerTimeMsByUserId(userId);
        double avgAnswerTimeMs = (avfAnswerTimeObj == null) ? 0.0 : avfAnswerTimeObj;

        // user XP/level
        User user = userRepository.findById(userId).orElse(null);
        long totalXp = user != null && user.getXpPoints() != null ? user.getXpPoints() : 0L;
        Integer currentLevel = user != null ? user.getLevel() : null;

        // top area by accuracy
        AreaStatDTO topAreaDto = null;
        List<Object[]> topAreas = attemptRepository.findTopAreasByAccuracy(userId, 1);
        if (topAreas != null && !topAreas.isEmpty()) {
            Object[] row = topAreas.getFirst();
            String areaId = row[0] != null ? row[0].toString() : null;
            long correct = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            long total = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            double accuracy = row[3] != null ? ((Number) row[3]).doubleValue() * 100.0 : 0.0;
            topAreaDto = AreaStatDTO.builder()
                    .areaId(areaId)
                    .correctCount(correct)
                    .totalCount(total)
                    .accuracyPct(accuracy)
                    .build();
        }
        // top 3 skills by correct count
        List<SkillStatDTO> topSkills = new ArrayList<>();
        List<Object[]> topSkillsRows = attemptRepository.findTopSkillsByCorrectCount(userId, 3);
        if (topSkillsRows != null) {
            for (Object[] row : topSkillsRows) {
                Long skillId = row[0] != null ? ((Number) row[0]).longValue() : null;
                long correct = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                long total = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                double accuracy = (total > 0) ? ((double) correct / total) * 100.0 : 0.0;
                topSkills.add(SkillStatDTO.builder()
                        .skillId(skillId)
                        .correctCount(correct)
                        .totalCount(total)
                        .accuracyPct(accuracy)
                        .build());
            }
        }
        // top 3 competencies by correct count
        List<CompetencyStatDTO> topCompetencies = new ArrayList<>();
        List<Object[]> topCompRows = attemptRepository.findTopCompetenciesByCorrectCount(userId, 3);
        if (topCompRows != null) {
            for (Object[] row : topCompRows) {
                Long compId = row[0] != null ? ((Number) row[0]).longValue() : null;
                long correct = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                long total = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                double accuracy = (total > 0) ? ((double) correct / total) * 100.0 : 0.0;
                topCompetencies.add(CompetencyStatDTO.builder()
                        .competencyId(compId)
                        .correctCount(correct)
                        .totalCount(total)
                        .accuracyPct(accuracy)
                        .build());
            }
        }
        long flashcardsCount = flashcardRepository.countByUserId(userId);

        return ProfileDTO.builder()
                .totalSessions(totalSessions)
                .overallAccuracyPct(round(overallAccuracyPct, 2))
                .avgAnswerTimeMs(round(avgAnswerTimeMs, 0))
                .totalXp(totalXp)
                .currentLevel(currentLevel)
                .topArea(topAreaDto)
                .topSkills(topSkills)
                .topCompetencies(topCompetencies)
                .flashcardsCount(flashcardsCount)
                .build();
    }
    private static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();

    }

}
