package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    Page<Flashcard> findByUser_Id(Long userId, Pageable pageable);

    Page<Flashcard> findByUser_IdAndArea_Id(Long userId, String areaId, Pageable pageable);

    long countByUserId(Long userId);

    boolean existsByIdAndArea_Id(Long userId, String areaId);
}