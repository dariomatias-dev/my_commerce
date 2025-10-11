package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.LoginRequest;
import com.dariomatias.my_commerce.dto.ResetPasswordRequest;
import com.dariomatias.my_commerce.dto.SignupRequest;
import com.dariomatias.my_commerce.model.EmailVerificationToken;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.EmailVerificationTokenRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.security.JwtUtil;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailVerificationTokenRepository tokenRepository,
                       EmailService emailService,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    public ApiResponse<String> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ApiResponse.error(401, "Credenciais inválidas");
        }

        User user = userOpt.get();
        if (!user.isEnabled()) {
            return ApiResponse.error(403, "E-mail não verificado");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ApiResponse.success(200, "Login realizado com sucesso", token);
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
        tokenRepository.save(verificationToken);

        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), token);
        } catch (MessagingException e) {
            return ApiResponse.error(500, "Erro ao enviar e-mail de verificação");
        }

        return ApiResponse.success(201, "Usuário cadastrado com sucesso. Verifique seu e-mail.", savedUser);
    }

    public ApiResponse<String> verifyEmail(String token) {
        Optional<EmailVerificationToken> optionalToken = tokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return ApiResponse.error(400, "Token inválido");
        }

        EmailVerificationToken verificationToken = optionalToken.get();

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ApiResponse.error(400, "Token expirado");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        tokenRepository.delete(verificationToken);

        return ApiResponse.success(200, "E-mail verificado com sucesso!", null);
    }

    public ApiResponse<String> resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ApiResponse.error(404, "Usuário não encontrado");
        }

        User user = userOpt.get();
        if (user.isEnabled()) {
            return ApiResponse.error(400, "E-mail já verificado");
        }

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                user,
                token,
                LocalDateTime.now().plusHours(24)
        );
        tokenRepository.save(verificationToken);

        try {
            emailService.sendVerificationEmail(email, token);
        } catch (MessagingException e) {
            return ApiResponse.error(500, "Erro ao enviar e-mail de verificação");
        }

        return ApiResponse.success(200, "E-mail de verificação reenviado com sucesso", null);
    }

    public ApiResponse<String> recoverPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ApiResponse.error(404, "Usuário não encontrado");
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();

        Optional<EmailVerificationToken> existingTokenOpt = tokenRepository.findByUserId(user.getId());
        EmailVerificationToken recoveryToken;

        if (existingTokenOpt.isPresent()) {
            recoveryToken = existingTokenOpt.get();
            recoveryToken.setToken(token);
            recoveryToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        } else {
            recoveryToken = new EmailVerificationToken(
                    user,
                    token,
                    LocalDateTime.now().plusHours(1)
            );
        }

        tokenRepository.save(recoveryToken);

        try {
            emailService.sendPasswordRecoveryEmail(email, token);
        } catch (MessagingException e) {
            return ApiResponse.error(500, "Erro ao enviar e-mail de recuperação de senha");
        }

        return ApiResponse.success(200, "E-mail de recuperação de senha enviado com sucesso", null);
    }

    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        Optional<EmailVerificationToken> optionalToken = tokenRepository.findByToken(request.getToken());
        if (optionalToken.isEmpty()) {
            return ApiResponse.error(400, "Token inválido");
        }

        EmailVerificationToken recoveryToken = optionalToken.get();

        if (recoveryToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ApiResponse.error(400, "Token expirado");
        }

        User user = recoveryToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        tokenRepository.delete(recoveryToken);

        return ApiResponse.success(200, "Senha redefinida com sucesso", null);
    }
}
