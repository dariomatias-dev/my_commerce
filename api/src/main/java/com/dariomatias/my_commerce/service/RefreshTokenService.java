package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.model.RefreshToken;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtService jwtService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }

    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(jwtService.generateRefreshToken(user.getEmail()));
        refreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(
                Long.parseLong(System.getenv().getOrDefault("JWT_REFRESH_EXPIRATION_MS", "604800000")) / 1000
        ));

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(LocalDateTime.now());
    }

    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
