package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID>, JpaSpecificationExecutor<Store> {
    Optional<Store> findBySlug(String slug);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    long countByIsActiveTrueAndDeletedAtIsNull();

    long countByIsActiveTrueAndDeletedAtIsNullAndAuditCreatedAtAfter(LocalDateTime startDate);
}
