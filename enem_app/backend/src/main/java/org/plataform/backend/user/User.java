package org.plataform.backend.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.plataform.backend.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.plataform.backend.dtos.UserRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "uuidUser")
@Table(name = "users", schema = "public")
@Entity
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user", nullable = false, updatable = false)
    private Long id_user;

    @Column(name = "uuid_user", nullable = false, updatable = false, unique = true)
    private UUID uuidUser;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Column(unique = true)
    private String email;

    @JsonIgnore                    // Jackson ignora na serialização
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)  // Só aceita escrita
    private String password_hash;

    @Column(name = "create_at", nullable = false, updatable = false)
    private Date create_at;

    @Column(name = "xp_points")
    private Integer xp_points;

    @Column(name = "level")
    private Integer level;

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
        this.role = UserRole.USER;
        this.provider = "local";
        this.isOauthUser = false;
    }

    @PrePersist
    protected void onCreate() {
        this.create_at = new Date();
        this.uuidUser = UUID.randomUUID();

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
            if (this.xp_points == null) this.xp_points = 0;
            if (this.level == null) this.level = 1;
        } else {
            this.xp_points = null;
            this.level = null;
        }
    }

    // Métodos utilitários
    public boolean isAdmin() {
        return this.role.isAdmin();
    }

    public void addXP(int points) {
        if (this.role == UserRole.USER && this.xp_points != null) {
            this.xp_points += points;
            updateLevel();
        }
    }

    private void updateLevel() {
        if (this.xp_points != null) {
            int newLevel = (this.xp_points / 100) + 1;
            this.level = newLevel;
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

