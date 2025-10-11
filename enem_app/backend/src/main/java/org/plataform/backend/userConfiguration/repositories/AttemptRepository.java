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


    @Query("SELECT COUNT(a) FROM Attempt a WHERE a.userId = :userId AND a.isCorrect = true")
    long countCorrectByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(a.answerTimeMs) FROM Attempt a WHERE a.userId = :userId AND a.answerTimeMs IS NOT NULL")
    Double averageAnswerTimeMsByUserId(@Param("userId") Long userId);

    /* ========== TOP AREAS (rank por correct_count) - retorna também area name ==========
       Columns returned: area_id, area_name, correct_count, total_count, accuracy
    */
    @Query(value = """
        SELECT q.area_id::text AS area_id,
               ka.name::text   AS area_name,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::bigint AS correct_count,
               COUNT(*)::bigint AS total_count,
               CASE WHEN COUNT(*) = 0 THEN 0.0
                    ELSE (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::double precision / COUNT(*)) * 100.0
               END AS accuracy_pct
        FROM attempts a
        JOIN questions q ON q.id = a.question_id
        LEFT JOIN knowledge_areas ka ON ka.id = q.area_id
        WHERE a.user_id = :userId
        GROUP BY q.area_id, ka.name
        ORDER BY correct_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopAreasByCorrectCount(@Param("userId") Long userId, @Param("limit") int limit);

    /* ========== TOP SKILLS (rank por correct_count) - retorna skill id + code/description ==========
       Columns returned: skill_id, skill_code, skill_description, correct_count, total_count, accuracy_pct
    */
    @Query(value = """
        SELECT q.skill_id::bigint AS skill_id,
               s.code::text        AS skill_code,
               s.description::text AS skill_description,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::bigint AS correct_count,
               COUNT(*)::bigint AS total_count,
               CASE WHEN COUNT(*) = 0 THEN 0.0
                    ELSE (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::double precision / COUNT(*)) * 100.0
               END AS accuracy_pct
        FROM attempts a
        JOIN questions q ON q.id = a.question_id
        LEFT JOIN skills s ON s.id = q.skill_id
        WHERE a.user_id = :userId
        GROUP BY q.skill_id, s.code, s.description
        ORDER BY correct_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopSkillsByCorrectCount(@Param("userId") Long userId, @Param("limit") int limit);

    /* ========== TOP COMPETENCIES (rank por correct_count) - retorna competency id + description ==========
       Columns returned: competency_id, competency_description, correct_count, total_count, accuracy_pct
    */
    @Query(value = """
        SELECT q.competency_id::bigint AS competency_id,
               c.description::text AS competency_description,
               SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::bigint AS correct_count,
               COUNT(*)::bigint AS total_count,
               CASE WHEN COUNT(*) = 0 THEN 0.0
                    ELSE (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::double precision / COUNT(*)) * 100.0
               END AS accuracy_pct
        FROM attempts a
        JOIN questions q ON q.id = a.question_id
        LEFT JOIN competencies c ON c.id = q.competency_id
        WHERE a.user_id = :userId
        GROUP BY q.competency_id, c.description
        ORDER BY correct_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> findTopCompetenciesByCorrectCount(@Param("userId") Long userId, @Param("limit") int limit);
}