package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID>, JpaSpecificationExecutor<Store> {
    Optional<Store> findBySlug(String slug);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    long countByIsActiveTrueAndDeletedAtIsNull();
}
