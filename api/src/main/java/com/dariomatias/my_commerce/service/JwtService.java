package com.dariomatias.my_commerce.service;

import org.springframework.stereotype.Component;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class JwtService {

    private final Dotenv dotenv = Dotenv.load();
    private final String secretKey = dotenv.get("JWT_SECRET");
    private final long accessTokenExpiration = Long.parseLong(dotenv.get("JWT_ACCESS_EXPIRATION_MS", "86400000"));
    private final long refreshTokenExpiration = Long.parseLong(dotenv.get("JWT_REFRESH_EXPIRATION_MS", "604800000"));

    public String generateAccessToken(String email) {
        return generateToken(email, accessTokenExpiration);
    }

    public String generateRefreshToken(String email) {
        return generateToken(email, refreshTokenExpiration);
    }

    private String generateToken(String email, long expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey.getBytes())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(secretKey.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();

            LocalDateTime expiryDateTime = LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault());
            return expiryDateTime.isBefore(LocalDateTime.now());
        } catch (Exception e) {
            return true;
        }
    }
}
