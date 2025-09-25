package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LevelRepository extends JpaRepository<Level, Long> {
}