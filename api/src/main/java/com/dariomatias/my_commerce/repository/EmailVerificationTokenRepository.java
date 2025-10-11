package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.EmailVerificationToken;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);

    Optional<EmailVerificationToken> findByUser(User user);
}
