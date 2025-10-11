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
        ApiResponse<RefreshTokenResponse> response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> signup(@Valid @RequestBody SignupRequest request) {
        ApiResponse<User> response = authService.registerUser(request);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {
        ApiResponse<String> response = authService.verifyEmail(request.getToken());
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/resend-verification-email")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@RequestBody @Valid ResendVerificationEmailRequest request) {
        ApiResponse<String> response = authService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/recover-password")
    public ResponseEntity<ApiResponse<String>> recoverPassword(@RequestBody @Valid RecoverPasswordRequest request) {
        ApiResponse<String> response = authService.recoverPassword(request.getEmail());
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse<String> response = authService.resetPassword(request);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        ApiResponse<RefreshTokenResponse> response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }
}
