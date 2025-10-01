package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findBySessionId(Long sessionId);

    long countByUserId(Long userId);

    @Query("SELECT COUNT(a) FROM Attempt a WHERE a.userId = :userId AND a.isCorrect = true")
    long countCorrectByUserId(@Param("userId") Long userID);

    @Query("SELECT AVG(a.answerTimeMs) FROM Attempt a WHERE a.userId = :userId AND a.answerTimeMs IS NOT NULL")
    Double averageAnswerTimeMsByUserId(@Param("userId") Long userId);

    //Top areas por accuracy
    @Query(value = """
        SELECT q.area_id AS area_id,
            SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct_count,
            COUNT(*)AS total_count,
            SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::double precision / COUNT(*) AS accuracy
        FROM attempts a
                JOIN questions q ON q.id = a.question_id
        WHERE a.user_id = :userID
        GROUP BY q.area_id
        ORDER BY accuracy DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopAreasByAccuracy(@Param("userID") Long userID, @Param("limit") int limit);

    // Top habilidades, conta somente respostas corretas
    @Query(value = """
        SELECT q.skill_id AS skill_id,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct_count,
               COUNT(*) AS total_count
        FROM attempts a
                 JOIN questions q ON q.id = a.question_id
        WHERE a.user_id = :userId
        GROUP BY q.skill_id
        ORDER BY correct_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopSkillsByCorrectCount(@Param("userId") Long userId, @Param("limit") int limit);

    // Top competencias, conta somente respostas corretas
    @Query(value = """
        SELECT q.competency_id AS competency_id,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct_count,
               COUNT(*) AS total_count
        FROM attempts a
                 JOIN questions q ON q.id = a.question_id
        WHERE a.user_id = :userId
        GROUP BY q.competency_id
        ORDER BY correct_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopCompetenciesByCorrectCount(@Param("userId") Long userId, @Param("limit") int limit);
}