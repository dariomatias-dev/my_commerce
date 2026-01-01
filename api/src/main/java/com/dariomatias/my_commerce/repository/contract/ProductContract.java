package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface ProductContract {

    Product save(Product product);

    Page<Product> findAll(Pageable pageable);

    Page<Product> findAllByStore(UUID storeId, Pageable pageable);

    Page<Product> findAllByStoreAndCategory(
            UUID storeId,
            UUID categoryId,
            Pageable pageable
    );

    Page<Product> findAllByCategory(UUID categoryId, Pageable pageable);

    Optional<Product> findByStoreSlugAndProductSlug(String storeSlug, String productSlug);

    Page<Product> findAllByStoreAndStockLessThanEqual(
            UUID storeId,
            int stockThreshold,
            Pageable pageable
    );

    Page<Product> findAllByStoreAndCategoryAndStockLessThanEqual(
            UUID storeId,
            UUID categoryId,
            int stockThreshold,
            Pageable pageable
    );

    Optional<Product> findById(UUID id);

    Product update(Product product);

    void deleteById(UUID id);
}
