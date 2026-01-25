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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(
        name = "Authentication",
        description = "Endpoints responsible for authentication, authorization, and account recovery"
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(
            summary = "User login",
            description = "Authenticates a user and returns access and refresh tokens."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(schema = @Schema(implementation = RefreshTokenResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid credentials"),
            @ApiResponse(responseCode = "403", description = "Email not verified")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResult<RefreshTokenResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        RefreshTokenResponse tokens = authService.login(request);

        return ResponseEntity.ok(
                ApiResult.success("Login successful.", tokens)
        );
    }

    @Operation(
            summary = "User signup",
            description = "Registers a new user and sends an email verification link."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid signup data"),
            @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    @PostMapping("/signup")
    public ResponseEntity<ApiResult<UserResponse>> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        UserResponse user = authService.register(request);

        return ResponseEntity
                .status(201)
                .body(
                        ApiResult.success(
                                201,
                                "User registered successfully. Please verify your email.",
                                user
                        )
                );
    }

    @Operation(
            summary = "Verify email",
            description = "Verifies a user's email address using the verification token."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResult<String>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request
    ) {
        authService.verifyEmail(request.getToken());

        return ResponseEntity.ok(
                ApiResult.success("Email verified successfully.", null)
        );
    }

    @Operation(
            summary = "Resend verification email",
            description = "Resends the email verification link to the user."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Verification email resent successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/resend-verification-email")
    public ResponseEntity<ApiResult<String>> resendVerificationEmail(
            @Valid @RequestBody ResendVerificationEmailRequest request
    ) {
        authService.resendVerificationEmail(request.getEmail());

        return ResponseEntity.ok(
                ApiResult.success("Verification email resent successfully.", null)
        );
    }

    @Operation(
            summary = "Recover password",
            description = "Sends a password recovery email to the user."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password recovery email sent successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/recover-password")
    public ResponseEntity<ApiResult<String>> recoverPassword(
            @Valid @RequestBody RecoverPasswordRequest request
    ) {
        authService.recoverPassword(request.getEmail());

        return ResponseEntity.ok(
                ApiResult.success("Password recovery email sent successfully.", null)
        );
    }

    @Operation(
            summary = "Reset password",
            description = "Resets the user's password using a valid reset token."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResult<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResult.success("Password reset successfully.", null)
        );
    }

    @Operation(
            summary = "Refresh access token",
            description = "Generates new access and refresh tokens using a valid refresh token."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Tokens refreshed successfully",
                    content = @Content(schema = @Schema(implementation = RefreshTokenResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid refresh token")
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResult<RefreshTokenResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        RefreshTokenResponse tokens =
                authService.refreshToken(request.getRefreshToken());

        return ResponseEntity.ok(
                ApiResult.success("Tokens refreshed successfully.", tokens)
        );
    }
}
