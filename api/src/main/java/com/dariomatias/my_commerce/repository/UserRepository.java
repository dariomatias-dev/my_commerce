package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRoleAndEnabledTrue(UserRole role);

    long countByEnabledTrueAndDeletedAtIsNull();

    long countByEnabledTrueAndDeletedAtIsNullAndAuditCreatedAtAfter(LocalDateTime startDate);
}
