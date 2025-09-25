package org.plataform.backend.userConfiguration.repositories;

import java.util.Optional;
import org.plataform.backend.userConfiguration.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByIdAndUserId(Long id, Long userId);
}