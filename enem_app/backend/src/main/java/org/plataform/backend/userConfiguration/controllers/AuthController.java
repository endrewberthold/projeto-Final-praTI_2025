package org.plataform.backend.userConfiguration.controllers;

import jakarta.validation.Valid;
import org.plataform.backend.userConfiguration.dtos.users.*;
import org.plataform.backend.userConfiguration.services.AuthService;
import org.plataform.backend.userConfiguration.services.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(
        origins = {"http://localhost", "http://localhost:80", "http://localhost:5173"},
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
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRequest userRequest) {
        UserResponse user = authService.registerUser(userRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UserResponse> registerAdmin(@Valid @RequestBody UserRequest userRequest) {
        UserResponse admin = authService.registerAdmin(userRequest);
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.ok("Logout realizado com sucesso");
    }

    // ========== ENDPOINTS DE RECUPERAÇÃO DE SENHA ==========

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = passwordResetService.requestPasswordReset(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ResetPasswordResponse response = passwordResetService.resetPassword(request);

        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate-reset-token/{token}")
    public ResponseEntity<ValidateTokenResponse> validateResetToken(@PathVariable String token) {
        ValidateTokenResponse response = passwordResetService.validateResetToken(token);

        if (response.valid()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}