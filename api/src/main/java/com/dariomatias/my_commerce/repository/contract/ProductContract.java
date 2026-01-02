package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductContract {

    Product save(Product product);

    Optional<Product> findByStoreSlugAndProductSlug(String storeSlug, String productSlug);

    Page<Product> findAll(ProductFilterDTO filter, Pageable pageable);

    Page<Product> findAllByStoreIdAndIdInAndDeletedAtIsNull(UUID storeId, List<UUID> ids, Pageable pageable);

    Optional<Product> findByIdAndDeletedAtIsNull(UUID id);

    Optional<Product> findById(UUID id);

    Product update(Product product);

    void delete(UUID id);
}
