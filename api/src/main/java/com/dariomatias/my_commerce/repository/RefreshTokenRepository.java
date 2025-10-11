package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.RefreshToken;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);

    void deleteByUser(User user);
}
