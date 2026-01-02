package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, UUID>,
        JpaSpecificationExecutor<Product> {
    Optional<Product> findByStore_SlugAndSlugAndDeletedAtIsNull(
            String storeSlug,
            String productSlug
    );

    Optional<Product> findByIdAndDeletedAtIsNull(UUID id);
}
