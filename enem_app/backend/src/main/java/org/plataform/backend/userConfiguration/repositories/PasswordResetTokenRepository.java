package org.plataform.backend.userConfiguration.repositories;

import org.plataform.backend.userConfiguration.user.PasswordResetToken;
import org.plataform.backend.userConfiguration.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Buscar token válido
    Optional<PasswordResetToken> findByTokenAndUsedFalseAndExpiresAtAfter(
            String token,
            LocalDateTime now
    );

    // Buscar por token (independente de validade)
    Optional<PasswordResetToken> findByToken(String token);

    // Buscar tokens não usados de um usuário
    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.user = :user AND prt.used = false")
    java.util.List<PasswordResetToken> findActiveTokensByUser(@Param("user") User user);

    // Marcar todos os tokens de um usuário como usados
    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetToken prt SET prt.used = true WHERE prt.user = :user AND prt.used = false")
    void markAllUserTokensAsUsed(@Param("user") User user);

    // Deletar tokens expirados (limpeza periódica)
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    // Verificar se usuário já tem token ativo recente (últimos 5 minutos)
    @Query("SELECT COUNT(prt) > 0 FROM PasswordResetToken prt WHERE prt.user = :user " +
            "AND prt.used = false AND prt.createdAt > :recentTime")
    boolean hasRecentActiveToken(@Param("user") User user, @Param("recentTime") LocalDateTime recentTime);
}