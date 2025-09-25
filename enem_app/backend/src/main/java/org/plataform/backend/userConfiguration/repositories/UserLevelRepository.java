package org.plataform.backend.userConfiguration.repositories;

import java.util.Optional;
import org.plataform.backend.userConfiguration.entity.UserLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLevelRepository extends JpaRepository<UserLevel, Long> {
    Optional<UserLevel> findByUserIdAndAreaIdAndLevelId(Long userId, String areaId, Long levelId);
}
