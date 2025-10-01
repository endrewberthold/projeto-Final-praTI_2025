package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}