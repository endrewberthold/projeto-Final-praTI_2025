package org.plataform.backend.userConfiguration.repositories;

import java.util.List;
import org.plataform.backend.userConfiguration.entity.Alternative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlternativeRepository extends JpaRepository<Alternative, Long> {
    List<Alternative> findByQuestionId(Long questionId);
}