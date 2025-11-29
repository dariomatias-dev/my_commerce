package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import com.dariomatias.my_commerce.repository.jdbc.ProductJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ProductAdapter {

    private final ProductRepository productRepository;
    private final ProductJdbcRepository productJdbcRepository;
    private final StoreRepository storeRepository;
    private final CategoryContract categoryRepository;
    private final boolean useJdbc;

    public ProductAdapter(ProductRepository productRepository,
                          ProductJdbcRepository productJdbcRepository,
                          StoreRepository storeRepository,
                          CategoryContract categoryRepository,
                          @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.productRepository = productRepository;
        this.productJdbcRepository = productJdbcRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
        this.useJdbc = useJdbc;
    }

    public Product save(Product product) {
        return useJdbc
                ? productJdbcRepository.save(product)
                : productRepository.save(product);
    }

    public Page<Product> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Product> list = productJdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return productRepository.findAll(pageable);
        }
    }

    public Page<Product> findAllByStore(UUID storeId, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Product> list = productJdbcRepository.findAllByStore(storeId, offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            Store store = storeRepository.findById(storeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
            return productRepository.findAllByStore(store, pageable);
        }
    }

    public Page<Product> findAllByCategory(UUID categoryId, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Product> list = productJdbcRepository.findAllByCategory(categoryId, offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
            return productRepository.findAllByCategory(category, pageable);
        }
    }

    public Optional<Product> findBySlug(String slug) {
        return useJdbc
                ? productJdbcRepository.findBySlug(slug)
                : productRepository.findBySlug(slug);
    }

    public Optional<Product> findById(UUID id) {
        return useJdbc
                ? productJdbcRepository.findById(id)
                : productRepository.findById(id);
    }

    public Product update(Product product) {
        if (useJdbc) productJdbcRepository.update(product);
        else productRepository.save(product);
        return product;
    }

    public void delete(UUID id) {
        if (useJdbc) productJdbcRepository.delete(id);
        else productRepository.deleteById(id);
    }
}
