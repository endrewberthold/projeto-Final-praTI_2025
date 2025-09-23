package org.plataform.backend.userConfiguration.repositories;

import java.util.List;
import org.plataform.backend.userConfiguration.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query(
            value = "SELECT q.* FROM questions q WHERE q.area_id = :areaId" +
                    " AND q.difficulty BETWEEN :minDiff AND :maxDiff" +
                    " ORDER BY random()" +
                    " LIMIT :limit",
            nativeQuery = true
    )
    List<Question> selectByAreaAndDifficultyRangeRandom(
            @Param("areaId") String areaId,
            @Param("minDiff") double minDiff,
            @Param("maxDiff") double maxDiff,
            @Param("limit") int limit);
}