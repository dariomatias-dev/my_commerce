package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.LoginRequest;
import com.dariomatias.my_commerce.dto.RecoverPasswordRequest;
import com.dariomatias.my_commerce.dto.ResendVerificationEmailRequest;
import com.dariomatias.my_commerce.dto.ResetPasswordRequest;
import com.dariomatias.my_commerce.dto.SignupRequest;
import com.dariomatias.my_commerce.dto.VerifyEmailRequest;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenRequest;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenResponse;
import com.dariomatias.my_commerce.dto.user.UserResponse;
import com.dariomatias.my_commerce.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResult<RefreshTokenResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        RefreshTokenResponse tokens = authService.login(request);

        return ResponseEntity.ok(
                ApiResult.success("Login realizado com sucesso", tokens)
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResult<UserResponse>> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        UserResponse user = authService.register(request);

        return ResponseEntity
                .status(201)
                .body(
                        ApiResult.success(201, "Usuário cadastrado com sucesso. Verifique seu e-mail", user)
                );
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResult<String>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request
    ) {
        authService.verifyEmail(request.getToken());

        return ResponseEntity.ok(
                ApiResult.success("E-mail verificado com sucesso", null)
        );
    }

    @PostMapping("/resend-verification-email")
    public ResponseEntity<ApiResult<String>> resendVerificationEmail(
            @Valid @RequestBody ResendVerificationEmailRequest request
    ) {
        authService.resendVerificationEmail(request.getEmail());

        return ResponseEntity.ok(
                ApiResult.success("E-mail de verificação reenviado com sucesso", null)
        );
    }

    @PostMapping("/recover-password")
    public ResponseEntity<ApiResult<String>> recoverPassword(
            @Valid @RequestBody RecoverPasswordRequest request
    ) {
        authService.recoverPassword(request.getEmail());

        return ResponseEntity.ok(
                ApiResult.success("E-mail de recuperação de senha enviado com sucesso", null)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResult<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResult.success("Senha redefinida com sucesso", null)
        );
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResult<RefreshTokenResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        RefreshTokenResponse tokens =
                authService.refreshToken(request.getRefreshToken());

        return ResponseEntity.ok(
                ApiResult.success("Tokens atualizados com sucesso", tokens)
        );
    }
}
