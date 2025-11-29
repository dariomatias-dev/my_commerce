package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface ProductContract {

    Product save(Product product);

    Product update(Product product);

    void delete(UUID id);

    Optional<Product> findById(UUID id);

    Optional<Product> findBySlug(String slug);

    Page<Product> findAll(Pageable pageable);

    Page<Product> findAllByStore(UUID storeId, Pageable pageable);

    Page<Product> findAllByCategory(UUID categoryId, Pageable pageable);
}
