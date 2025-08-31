package org.plataform.backend.userConfiguration.user;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

// Enum para definir os papéis de usuário
public enum UserRole {
    ADMIN,
    USER;

    // Método que retorna a lista de permissões para um usuário
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // ADMIN tem permissão de ADMIN e USER
        if (this == ADMIN) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        }
        // USER tem apenas permissão de USER
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // Converte o papel para a string de autoridade do Spring Security
    public String getAuthorityName() {
        return "ROLE_" + this.name();
    }

    // Métodos utilitários para verificar o papel
    public boolean isAdmin() {
        return this == ADMIN;
    }

    public boolean hasAdminPrivileges() {
        return this == ADMIN;
    }
}

