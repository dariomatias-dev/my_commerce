package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {
}
