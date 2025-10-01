package org.plataform.backend.userConfiguration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.plataform.backend.userConfiguration.dtos.users.UserRequest;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.ColumnDefault;
import org.plataform.backend.userConfiguration.userRole.UserRole;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.ZoneOffset;
import java.util.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user", nullable = false, updatable = false)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String nickname;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Column(unique = true)
    private String email;

    @JsonIgnore // JSON ignora na serialização
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // Só aceita escrita
    private String password_hash;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "level", nullable = false)
    private Integer level;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "xp_points", nullable = false)
    private Integer xpPoints;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role = UserRole.USER;

    @Column(name = "provider")
    private String provider;

    @Column(name = "is_oauth_user")
    private Boolean isOauthUser = false;

    // Construtor para registro
    public User(UserRequest userRequest) {
        this.name = userRequest.name();
        this.email = userRequest.email();
        this.password_hash = userRequest.password();
        this.provider = "local";
        this.isOauthUser = false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now(ZoneOffset.UTC);

        if (this.role == null) {
            this.role = UserRole.USER;
        }

        if (this.provider == null) {
            this.provider = "local";
        }

        if (this.isOauthUser == null) {
            this.isOauthUser = false;
        }

        // Só define XP e level para usuários normais
        if (this.role == UserRole.USER) {
            if (this.xpPoints == null) this.xpPoints = 0;
            if (this.level == null) this.level = 1;
        } else {
            this.xpPoints = null;
            this.level = null;
        }
    }

    // Métodos utilitários
    public boolean isAdmin() {
        return this.role.isAdmin();
    }

    public void addXP(int points) {
        if (this.role == UserRole.USER && this.xpPoints != null) {
            this.xpPoints += points;
            updateLevel();
        }
    }

    private void updateLevel() {
        if (this.xpPoints != null) {
            this.xpPoints = (this.xpPoints / 100) + 1;
        }
    }

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(this.role == UserRole.ADMIN) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
    @Override
    @JsonIgnore
    public String getPassword() {
        return password_hash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    /* ===== GETTER/SETTER CUSTOMIZADO PARA SENHA ===== */
    @JsonIgnore
    public String isPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }
}