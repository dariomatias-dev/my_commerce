package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.*;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenResponse;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
import jakarta.mail.MessagingException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

@Service
public class AuthService {

    private final AuditLogService auditLogService;
    private final UserAdapter userAdapter;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String VERIFICATION_PREFIX = "email_verification:";
    private static final String PASSWORD_RECOVERY_PREFIX = "password_recovery:";

    public AuthService(UserAdapter userAdapter,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService,
                       RedisTemplate<String, Object> redisTemplate,
                       JwtService jwtService,
                       AuditLogService auditLogService) {
        this.userAdapter = userAdapter;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.redisTemplate = redisTemplate;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
    }

    public RefreshTokenResponse login(LoginRequest request) {
        User user = userAdapter.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logLoginAttempt(user.getId().toString(), "failure");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        if (!user.isEnabled()) {
            logLoginAttempt(user.getId().toString(), "failure");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "E-mail não verificado");
        }

        logLoginAttempt(user.getId().toString(), "success");
        return generateTokensForUser(user);
    }

    private void logLoginAttempt(String userId, String result) {
        Map<String, Object> details = Map.of(
                "action", "login"
        );
        auditLogService.log(userId, "login", result, details);
    }

    public User register(SignupRequest request) {
        userAdapter.findByEmail(request.getEmail())
                .ifPresent(u -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já está em uso"); });
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(false);
        User savedUser = userAdapter.save(user);
        try {
            sendVerificationEmail(savedUser);
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao enviar e-mail de verificação");
        }
        return savedUser;
    }

    public void verifyEmail(String token) {
        validateToken(VERIFICATION_PREFIX + token, user -> {
            user.setEnabled(true);
            userAdapter.save(user);
        });
    }

    public void resendVerificationEmail(String email) {
        User user = userAdapter.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        if (user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail já verificado");
        }
        try {
            sendVerificationEmail(user);
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao enviar e-mail de verificação");
        }
    }

    private void sendVerificationEmail(User user) throws MessagingException {
        String token = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(VERIFICATION_PREFIX + token, user.getId().toString(), 24, TimeUnit.HOURS);
        
        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    public void recoverPassword(String email) {
        User user = userAdapter.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(PASSWORD_RECOVERY_PREFIX + token, user.getId().toString(), 1, TimeUnit.HOURS);
        try {
            emailService.sendPasswordRecoveryEmail(user.getEmail(), token);
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao enviar e-mail de recuperação");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        validateToken(PASSWORD_RECOVERY_PREFIX + request.getToken(), user -> {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userAdapter.save(user);
        });
    }

    public RefreshTokenResponse refreshToken(String refreshTokenStr) {
        String userId = (String) redisTemplate.opsForValue().get(refreshTokenStr);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido ou expirado");
        }
        User user = userAdapter.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));
        redisTemplate.delete(refreshTokenStr);
        return generateTokensForUser(user);
    }

    private RefreshTokenResponse generateTokensForUser(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        long expirationSeconds = Long.parseLong(System.getenv().getOrDefault("JWT_REFRESH_EXPIRATION_MS", "604800000")) / 1000;
        redisTemplate.opsForValue().set(refreshToken, user.getId().toString(), expirationSeconds, TimeUnit.SECONDS);
        return new RefreshTokenResponse(accessToken, refreshToken);
    }

    private void validateToken(String redisKey, Consumer<User> action) {
        String userIdStr = (String) redisTemplate.opsForValue().get(redisKey);
        if (userIdStr == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido ou expirado");
        }
        User user = userAdapter.findById(UUID.fromString(userIdStr))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não encontrado"));
        action.accept(user);
        redisTemplate.delete(redisKey);
    }
}
