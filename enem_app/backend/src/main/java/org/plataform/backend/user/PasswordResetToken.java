package org.plataform.backend.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
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
    private LocalDateTime expiresAt;

    @Column(name = "used", nullable = false)
    private Boolean used = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.token == null) {
            this.token = UUID.randomUUID().toString();
        }
        if (this.expiresAt == null) {
            // Token expira em 1 hora
            this.expiresAt = LocalDateTime.now().plusHours(1);
        }
        if (this.used == null) {
            this.used = false;
        }
    }

    // Construtor para criar token
    public PasswordResetToken(User user) {
        this.user = user;
        this.token = UUID.randomUUID().toString();
        this.expiresAt = LocalDateTime.now().plusHours(1);
        this.used = false;
    }

    // Método para verificar se token é válido
    public boolean isValid() {
        return !this.used && this.expiresAt.isAfter(LocalDateTime.now());
    }

    // Método para marcar como usado
    public void markAsUsed() {
        this.used = true;
    }
}