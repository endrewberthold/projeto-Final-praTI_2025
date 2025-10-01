package org.plataform.backend.userConfiguration.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.plataform.backend.userConfiguration.dtos.users.*;
import org.plataform.backend.userConfiguration.services.AuthService;
import org.plataform.backend.userConfiguration.services.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.DELETE, RequestMethod.OPTIONS},
                allowCredentials = "true")


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    @Operation(summary = "Cadastrar usuário padrão")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário cadastrado com sucesso", content = @Content(
                    schema = @Schema(implementation = UserResponse.class)
            )),
            @ApiResponse(responseCode = "400", description = "Usuário já cadastrado ou parâmetros inválidos",
                    content = @Content),
    })
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRequest userRequest) {
        UserResponse user = authService.registerUser(userRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register/admin")
    @Operation(summary = "Cadastrar usuário administrador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário admin cadastrado com sucesso",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Usuário já cadastrado ou parâmetros inválidos",
                    content = @Content)
    })
    public ResponseEntity<UserResponse> registerAdmin(@Valid @RequestBody UserRequest userRequest) {
        UserResponse admin = authService.registerAdmin(userRequest);
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/login")
    @Operation(summary = "Login do usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário logado com sucesso", content = @Content(
                    schema = @Schema(implementation = LoginResponse.class)
            )),
            @ApiResponse(responseCode = "401", description = "E-mail ou senha incorretos",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Dados inseridos são inválidos",
                    content = @Content),

    })
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar acess token", description = "Gera um novo acess token a partir de um refresh token válido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token renovado com sucesso",
                    content = @Content(schema = @Schema(implementation = RefreshTokenResponse.class))),
            @ApiResponse(responseCode = "400", description = "Refresh token inválido ou expirado",
                    content = @Content)
    })
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout do usuário", description = "Invalida o refresh token e encerra a sessão do usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Refresh token inválido",
                    content = @Content)
    })
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.ok("Logout realizado com sucesso");
    }

    // ========== ENDPOINTS DE RECUPERAÇÃO DE SENHA ==========

    @PostMapping("/forgot-password")
    @Operation(summary = "Recuperar senha", description = "Envia instruções de redefinição de senha para e-mail do usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Solicitação de redefinição enviada",
                    content = @Content(schema = @Schema(implementation = ForgotPasswordResponse.class))),
            @ApiResponse(responseCode = "400", description = "E-mail inválido",
                    content = @Content)
    })
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = passwordResetService.requestPasswordReset(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Redefinir senha", description = "Redefine senha do usuário utilizando reset token válido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso",
                    content = @Content(schema = @Schema(implementation = ResetPasswordResponse.class))),
            @ApiResponse(responseCode = "400", description = "Token inválido ou parâmetros incorretos",
                    content = @Content)
    })
    public ResponseEntity<ResetPasswordResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ResetPasswordResponse response = passwordResetService.resetPassword(request);

        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate-reset-token/{token}")
    @Operation(summary = "Validar reset token", description = "Verifica se o token de recuperação de senha é válido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token válido",
                    content = @Content(schema = @Schema(implementation = ValidateTokenResponse.class))),
            @ApiResponse(responseCode = "400", description = "Token inválido ou expirado",
                    content = @Content)
    })
    public ResponseEntity<ValidateTokenResponse> validateResetToken(@PathVariable String token) {
        ValidateTokenResponse response = passwordResetService.validateResetToken(token);

        if (response.valid()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}