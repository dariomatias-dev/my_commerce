package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, UUID>,
        JpaSpecificationExecutor<Product> {
    Page<Product> findAllByStore_IdAndIdInAndDeletedAtIsNull(UUID storeId, List<UUID> ids, Pageable pageable);

    Optional<Product> findByStore_SlugAndSlugAndDeletedAtIsNull(
            String storeSlug,
            String productSlug
    );

    Optional<Product> findByIdAndDeletedAtIsNull(UUID id);

    List<Product> findAllByStore_IdAndDeletedAtIsNull(UUID storeId);

    boolean existsBySlug(String slug);

    long countByStore_User_IdAndActiveTrueAndDeletedAtIsNull(UUID userId);

    long countByStore_IdAndActiveTrue(UUID storeId);

    @Modifying
    @Query("""
        update Product p
           set p.deletedAt = CURRENT_TIMESTAMP,
               p.active = false
         where p.store.id = :storeId
           and p.deletedAt is null
    """)
    void deleteByStoreId(@Param("storeId") UUID storeId);
}
