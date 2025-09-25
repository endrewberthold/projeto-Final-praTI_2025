package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.entity.Competency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetencyRepository extends JpaRepository<Competency, Long> {
}