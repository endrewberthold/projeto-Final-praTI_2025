package org.plataform.backend.userConfiguration.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.plataform.backend.userConfiguration.entity.KnowledgeArea;

public interface KnowledgeAreaRepository extends JpaRepository<KnowledgeArea, String> {
}
