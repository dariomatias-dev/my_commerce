package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.*;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenResponse;
import com.dariomatias.my_commerce.model.EmailVerificationToken;
import com.dariomatias.my_commerce.model.RefreshToken;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.EmailVerificationTokenRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public RefreshTokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "E-mail não verificado");
        }

        return generateTokensForUser(user);
    }

    public User registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já está em uso");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(false);

        User savedUser = userRepository.save(user);
        try {
            sendVerificationEmail(savedUser);
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao enviar e-mail de verificação");
        }

        return savedUser;
    }

    public void verifyEmail(String token) {
        validateToken(token, user -> {
            user.setEnabled(true);
            userRepository.save(user);
        });
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
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

    public void recoverPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        EmailVerificationToken token = createOrUpdateToken(user, 1);
        try {
            emailService.sendPasswordRecoveryEmail(user.getEmail(), token.getToken());
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao enviar e-mail de recuperação");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        validateToken(request.getToken(), user -> {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
        });
    }

    public RefreshTokenResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido"));

        if (refreshTokenService.isExpired(refreshToken)) {
            refreshTokenService.deleteByUser(refreshToken.getUser());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expirado");
        }

        return generateTokensForUser(refreshToken.getUser());
    }

    private RefreshTokenResponse generateTokensForUser(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return new RefreshTokenResponse(accessToken, refreshToken.getToken());
    }

    private void sendVerificationEmail(User user) throws MessagingException {
        EmailVerificationToken token = createOrUpdateToken(user, 24);
        emailService.sendVerificationEmail(user.getEmail(), token.getToken());
    }

    private EmailVerificationToken createOrUpdateToken(User user, int hoursValid) {
        Optional<EmailVerificationToken> existingTokenOpt = emailVerificationTokenRepository.findByUserId(user.getId());

        EmailVerificationToken token = existingTokenOpt.orElseGet(() ->
                new EmailVerificationToken(user, UUID.randomUUID().toString(), LocalDateTime.now().plusHours(hoursValid))
        );

        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusHours(hoursValid));

        return emailVerificationTokenRepository.save(token);
    }

    private void validateToken(String tokenStr, Consumer<User> action) {
        EmailVerificationToken emailVerificationToken = emailVerificationTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido"));

        if (emailVerificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expirado");
        }

        action.accept(emailVerificationToken.getUser());
        emailVerificationTokenRepository.delete(emailVerificationToken);
    }
}
