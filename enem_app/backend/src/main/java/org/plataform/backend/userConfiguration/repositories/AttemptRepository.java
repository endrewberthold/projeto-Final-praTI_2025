package org.plataform.backend.userConfiguration.repositories;

import java.util.List;
import org.plataform.backend.userConfiguration.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findBySessionId(Long sessionId);
}