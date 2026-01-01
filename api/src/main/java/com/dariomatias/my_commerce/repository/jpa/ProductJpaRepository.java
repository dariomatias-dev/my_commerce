package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.enums.ProductStatus;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.repository.specification.ProductSpecification;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class ProductJpaRepository implements ProductContract {

    private final ProductRepository repository;

    public ProductJpaRepository(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product save(Product product) {
        return repository.save(product);
    }

    @Override
    public Optional<Product> findByStoreSlugAndProductSlug(String storeSlug, String productSlug) {
        return repository.findByStore_SlugAndSlugAndDeletedAtIsNull(storeSlug, productSlug);
    }

    @Override
    public Page<Product> findAll(ProductFilterDTO filter, Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> null;

        spec = spec.and(ProductSpecification.store(filter.getStoreId()));

        if (filter.getCategoryId() != null) {
            spec = spec.and(ProductSpecification.category(filter.getCategoryId()));
        }

        if (filter.getLowStockThreshold() != null) {
            spec = spec.and(ProductSpecification.lowStock(filter.getLowStockThreshold()));
        }

        ProductStatus status = filter.getStatus() != null ? filter.getStatus() : ProductStatus.ACTIVE;

        if (status == ProductStatus.ACTIVE) {
            spec = spec.and(ProductSpecification.active());
        } else if (status == ProductStatus.DELETED) {
            spec = spec.and(ProductSpecification.deleted());
        }

        return repository.findAll(spec, pageable);
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Product update(Product product) {
        return repository.save(product);
    }

    @Override
    public void delete(UUID id) {
        Product product = repository.findById(id)
                .orElseThrow();

        product.delete();

        repository.save(product);
    }
}
