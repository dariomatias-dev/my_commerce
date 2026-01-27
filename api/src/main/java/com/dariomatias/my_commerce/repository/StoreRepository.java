package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Store;
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
public interface StoreRepository
        extends JpaRepository<Store, UUID>,
        JpaSpecificationExecutor<Store> {
    List<Store> findAllByUser_Id(UUID userId);

    Optional<Store> findBySlug(String slug);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    boolean existsBySlug(String slug);

    long countByIsActiveTrueAndDeletedAtIsNull();

    @Modifying
    @Query("""
        update Store s
           set s.deletedAt = CURRENT_TIMESTAMP,
               s.isActive = false
         where s.user.id = :userId
           and s.deletedAt is null
    """)
    void deleteByUserId(@Param("userId") UUID userId);
}
