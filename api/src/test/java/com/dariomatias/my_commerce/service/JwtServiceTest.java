package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtService")
class JwtServiceTest {

    private static final String TEST_SECRET = "test-secret-key-for-jwt-tests-32b!";

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        Dotenv dotenv = mock(Dotenv.class);
        when(dotenv.get("JWT_SECRET")).thenReturn(TEST_SECRET);
        when(dotenv.get("JWT_ACCESS_EXPIRATION_MS", "86400000")).thenReturn("86400000");
        when(dotenv.get("JWT_REFRESH_EXPIRATION_MS", "604800000")).thenReturn("604800000");

        try (MockedStatic<Dotenv> dotenvStatic = mockStatic(Dotenv.class)) {
            dotenvStatic.when(Dotenv::load).thenReturn(dotenv);
            jwtService = new JwtService();
        }

        user = new User();
        user.setId(UUID.randomUUID());
        user.setRole(UserRole.USER);
    }

    @Test
    @DisplayName("generateAccessToken should contain subject equal to user ID")
    void generateAccessToken_shouldContainCorrectSubject() {
        String token = jwtService.generateAccessToken(user);
        assertEquals(user.getId().toString(), jwtService.getIdFromToken(token));
    }

    @Test
    @DisplayName("generateRefreshToken should contain subject equal to user ID")
    void generateRefreshToken_shouldContainCorrectSubject() {
        String token = jwtService.generateRefreshToken(user);
        assertEquals(user.getId().toString(), jwtService.getIdFromToken(token));
    }

    @Test
    @DisplayName("validateToken with valid token should return true")
    void validateToken_withValidToken_shouldReturnTrue() {
        String token = jwtService.generateAccessToken(user);
        assertTrue(jwtService.validateToken(token));
    }

    @Test
    @DisplayName("validateToken with expired token should return false")
    void validateToken_withExpiredToken_shouldReturnFalse() {
        String expiredToken = Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(new Date(System.currentTimeMillis() - 3600000))
                .setExpiration(new Date(System.currentTimeMillis() - 1800000))
                .signWith(Keys.hmacShaKeyFor(TEST_SECRET.getBytes()), SignatureAlgorithm.HS256)
                .compact();

        assertFalse(jwtService.validateToken(expiredToken));
    }

    @Test
    @DisplayName("validateToken with invalid string should return false")
    void validateToken_withInvalidToken_shouldReturnFalse() {
        assertFalse(jwtService.validateToken("not.a.valid.token"));
    }

    @Test
    @DisplayName("getIdFromToken should parse user ID correctly")
    void getIdFromToken_shouldParseIdCorrectly() {
        String token = jwtService.generateAccessToken(user);
        assertEquals(user.getId().toString(), jwtService.getIdFromToken(token));
    }
}
