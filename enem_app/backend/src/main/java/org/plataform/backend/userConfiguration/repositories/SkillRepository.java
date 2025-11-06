package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByIdIn(List<Long> ids);
}
