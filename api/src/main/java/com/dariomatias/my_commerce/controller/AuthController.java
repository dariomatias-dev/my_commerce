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

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam("token") String token) {
        ApiResponse<String> response = authService.verifyEmail(token);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/resend-verification-email")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@RequestParam String email) {
        ApiResponse<String> response = authService.resendVerificationEmail(email);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/recover-password")
    public ResponseEntity<ApiResponse<String>> recoverPassword(@RequestParam String email) {
        ApiResponse<String> response = authService.recoverPassword(email);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse<String> response = authService.resetPassword(request);
        return ResponseEntity.status(response.getCode()).body(response);
    }
}
