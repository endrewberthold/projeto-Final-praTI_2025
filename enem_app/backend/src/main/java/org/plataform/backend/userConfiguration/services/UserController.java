package org.plataform.backend.userConfiguration.services;


import org.plataform.backend.userConfiguration.dtos.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserServiceRep userService;

    //endpoint é usado para que um usuário autenticado obtenha suas próprias informações de perfil
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {
        // Obtém o objeto de autenticação do contexto de segurança
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserResponse user = userService.getUserProfile(email);
        return ResponseEntity.ok(user);
    }

    //endpoint é usado para obter uma lista de todos os usuários do sistema
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}