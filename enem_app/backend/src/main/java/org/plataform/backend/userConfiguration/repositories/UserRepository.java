package org.plataform.backend.userConfiguration.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.plataform.backend.userConfiguration.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

}
