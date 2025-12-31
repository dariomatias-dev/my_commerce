package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Page<Product> findAllByStore(Store store, Pageable pageable);

    Page<Product> findAllByStoreAndCategory(
            Store store,
            Category category,
            Pageable pageable
    );

    Page<Product> findAllByCategory(Category category, Pageable pageable);

    Optional<Product> findByStore_SlugAndSlug(String storeSlug, String productSlug);

    Page<Product> findAllByStore_SlugAndStockLessThanEqual(String storeSlug, int stockThreshold, Pageable pageable);
}
