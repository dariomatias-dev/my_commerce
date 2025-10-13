package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.*;
import com.dariomatias.my_commerce.model.EmailVerificationToken;
import com.dariomatias.my_commerce.model.RefreshToken;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.EmailVerificationTokenRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailVerificationTokenRepository emailVerificationTokenRepository,
                       EmailService emailService,
                       RefreshTokenService refreshTokenService,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    public ApiResponse<RefreshTokenResponse> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ApiResponse.error(401, "Credenciais inválidas");
        }

        User user = userOpt.get();
        if (!user.isEnabled()) {
            return ApiResponse.error(403, "E-mail não verificado");
        }

        return ApiResponse.success(200, "Login realizado com sucesso", generateTokensForUser(user));
    }

    public ApiResponse<User> registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error(409, "Email já está em uso");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(false);

        User savedUser = userRepository.save(user);
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                savedUser,
                token,
                LocalDateTime.now().plusHours(24)
        );
        emailVerificationTokenRepository.save(verificationToken);

        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), token);
        } catch (MessagingException e) {
            return ApiResponse.error(500, "Erro ao enviar e-mail de verificação");
        }

        return ApiResponse.success(201, "Usuário cadastrado com sucesso. Verifique seu e-mail", savedUser);
    }

    public ApiResponse<String> verifyEmail(String token) {
        return validateToken(token, user -> {
            user.setEnabled(true);
            userRepository.save(user);
        });
    }

    public ApiResponse<String> resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ApiResponse.error(404, "Usuário não encontrado");

        User user = userOpt.get();
        if (user.isEnabled()) return ApiResponse.error(400, "E-mail já verificado");

        ApiResponse<String> response = sendVerificationEmail(user);
        if (!response.isSuccess()) return response;

        return ApiResponse.success(200, "E-mail de verificação reenviado com sucesso", null);
    }

    public ApiResponse<String> recoverPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ApiResponse.error(404, "Usuário não encontrado");

        User user = userOpt.get();
        EmailVerificationToken token = createOrUpdateToken(user, 1);

        try {
            emailService.sendPasswordRecoveryEmail(user.getEmail(), token.getToken());
        } catch (MessagingException e) {
            return ApiResponse.error(500, "Erro ao enviar e-mail de recuperação de senha");
        }

        return ApiResponse.success(200, "E-mail de recuperação de senha enviado com sucesso", null);
    }

    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        return validateToken(request.getToken(), user -> {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
        });
    }

    public ApiResponse<RefreshTokenResponse> refreshToken(String refreshTokenStr) {
        Optional<RefreshToken> optionalToken = refreshTokenService.findByToken(refreshTokenStr);
        if (optionalToken.isEmpty()) return ApiResponse.error(401, "Refresh token inválido");

        RefreshToken refreshToken = optionalToken.get();
        if (refreshTokenService.isExpired(refreshToken)) {
            refreshTokenService.deleteByUser(refreshToken.getUser());

            return ApiResponse.error(401, "Refresh token expirado");
        }

        return ApiResponse.success(200, "Tokens atualizados com sucesso", generateTokensForUser(refreshToken.getUser()));
    }

    private RefreshTokenResponse generateTokensForUser(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new RefreshTokenResponse(accessToken, refreshToken.getToken());
    }

    private ApiResponse<String> sendVerificationEmail(User user) {
        EmailVerificationToken token = createOrUpdateToken(user, 24);

        try {
            emailService.sendVerificationEmail(user.getEmail(), token.getToken());
            return ApiResponse.success(200, "E-mail de verificação enviado com sucesso", null);
        } catch (MessagingException e) {
            return ApiResponse.error(500, "Erro ao enviar e-mail de verificação");
        }
    }

    private EmailVerificationToken createOrUpdateToken(User user, int hoursValid) {
        Optional<EmailVerificationToken> existingTokenOpt = emailVerificationTokenRepository.findByUserId(user.getId());

        EmailVerificationToken token;
        if (existingTokenOpt.isPresent()) {
            token = existingTokenOpt.get();
            token.setToken(UUID.randomUUID().toString());
            token.setExpiryDate(LocalDateTime.now().plusHours(hoursValid));
        } else {
            token = new EmailVerificationToken(user, UUID.randomUUID().toString(), LocalDateTime.now().plusHours(hoursValid));
        }

        return emailVerificationTokenRepository.save(token);
    }

    private ApiResponse<String> validateToken(String tokenStr, Consumer<User> action) {
        EmailVerificationToken emailVerificationToken = emailVerificationTokenRepository.findByToken(tokenStr)
                .orElse(null);

        if (emailVerificationToken == null)
            return ApiResponse.error(400, "Token inválido");

        LocalDateTime expiryDate = emailVerificationToken.getExpiryDate();
        if (expiryDate.isBefore(LocalDateTime.now()))
            return ApiResponse.error(400, "Token expirado");

        action.accept(emailVerificationToken.getUser());
        emailVerificationTokenRepository.delete(emailVerificationToken);

        return ApiResponse.success(200, "Operação realizada com sucesso", null);
    }
}
