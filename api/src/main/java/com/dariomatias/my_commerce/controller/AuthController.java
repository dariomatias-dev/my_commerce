package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.LoginRequest;
import com.dariomatias.my_commerce.dto.SignupRequest;
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
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> signup(@RequestBody @Valid SignupRequest request) {
        ApiResponse<User> response = authService.registerUser(request);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam("token") String token) {
        ApiResponse<String> response = authService.verifyEmail(token);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @GetMapping("/resend-verification-email")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@RequestParam String email) {
        ApiResponse<String> response = authService.resendVerificationEmail(email);
        return ResponseEntity.status(response.getCode()).body(response);
    }
}
