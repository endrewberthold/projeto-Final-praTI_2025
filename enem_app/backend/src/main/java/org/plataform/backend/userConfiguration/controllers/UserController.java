package org.plataform.backend.userConfiguration.controllers;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.plataform.backend.userConfiguration.dtos.users.UserResponse;
import org.plataform.backend.userConfiguration.services.UserServiceRep;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserServiceRep userService;

    public UserController(UserServiceRep userService) {
        this.userService = userService;
    }

    /**@author Jakeline
     * endpoint é usado para que um usuário autenticado obtenha suas próprias informações de perfil
     * **/
    @GetMapping("/profile")
    @Operation(
            summary = "Obter perfil do usuário",
            description = "Retorna as informações de perfil do usuário atualmente autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso",
                    content = @Content(
                            schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Usuário não autenticado",
                    content = @Content)
    })
    public ResponseEntity<UserResponse> getProfile() {
        // Obtém o objeto de autenticação do contexto de segurança
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserResponse user = userService.getUserProfile(email);
        return ResponseEntity.ok(user);
    }

    /**@author Jakeline
     * endpoint é usado para obter uma lista de todos os usuários do sistema
     * **/
    @GetMapping("/all")
    @Operation(
            summary = "Listar todos os usuários",
            description = "Retorna uma lista com todos os usuários cadastrados no sistema."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuários retornada",
                    content = @Content(
                            schema = @Schema(implementation = UserResponse.class)))
    })
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}