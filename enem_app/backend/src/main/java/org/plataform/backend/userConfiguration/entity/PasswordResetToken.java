package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "password_reset", schema = "public")
@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id_user", nullable = false)
    private User user;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "used", nullable = false)
    private Boolean used = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now(ZoneOffset.UTC);

        if (this.token == null) {
            this.token = UUID.randomUUID().toString();
        }
        if (this.expiresAt == null) {
            // Token expira em 1 hora
            this.expiresAt = OffsetDateTime.now().plusHours(1);
        }
        if (this.used == null) {
            this.used = false;
        }
    }

    // Construtor para criar token
    public PasswordResetToken(User user) {
        this.user = user;
        this.token = UUID.randomUUID().toString();
        this.expiresAt = OffsetDateTime.now().plusHours(1);
        this.used = false;
    }

    // method para verificar se token é válido
    public boolean isValid() {
        return !this.used && this.expiresAt.isAfter(OffsetDateTime.now());
    }

    // method para marcar como usado
    public void markAsUsed() {
        this.used = true;
    }
}