package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.*;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        RefreshTokenResponse tokens = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login realizado com sucesso", tokens));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> signup(@Valid @RequestBody SignupRequest request) {
        User user = authService.registerUser(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Usuário cadastrado com sucesso. Verifique seu e-mail", user));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request.getToken());
        return ResponseEntity.ok(ApiResponse.success("E-mail verificado com sucesso", null));
    }

    @PostMapping("/resend-verification-email")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@Valid @RequestBody ResendVerificationEmailRequest request) {
        authService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("E-mail de verificação reenviado com sucesso", null));
    }

    @PostMapping("/recover-password")
    public ResponseEntity<ApiResponse<String>> recoverPassword(@Valid @RequestBody RecoverPasswordRequest request) {
        authService.recoverPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("E-mail de recuperação de senha enviado com sucesso", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);

        return ResponseEntity.ok(ApiResponse.success("Senha redefinida com sucesso", null));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse tokens = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Tokens atualizados com sucesso", tokens));
    }
}
