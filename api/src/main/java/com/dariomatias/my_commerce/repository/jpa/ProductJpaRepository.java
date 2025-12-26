package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<Product> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Product> findAllByStore(UUID storeId, Pageable pageable) {
        Store store = new Store();
        store.setId(storeId);
        return repository.findAllByStore(store, pageable);
    }

    @Override
    public Page<Product> findAllByCategory(UUID categoryId, Pageable pageable) {
        Category category = new Category();
        category.setId(categoryId);
        return repository.findAllByCategory(category, pageable);
    }

    @Override
    public Optional<Product> findByStoreSlugAndProductSlug(String storeSlug, String productSlug) {
        return repository.findByStore_SlugAndSlug(storeSlug,  productSlug);
    }

    @Override
    public Page<Product> findAllByStoreSlugAndStockLessThanEqual(String storeSlug, int threshold, Pageable pageable) {
        return repository.findAllByStore_SlugAndStockLessThanEqual(storeSlug, threshold, pageable);
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
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
