package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.jdbc.CategoryJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Component
public class CategoryAdapter {

    private final CategoryRepository categoryRepository;
    private final CategoryJdbcRepository categoryJdbcRepository;
    private final boolean useJdbc;
    private final StoreRepository storeRepository;

    public CategoryAdapter(CategoryRepository categoryRepository,
                           CategoryJdbcRepository categoryJdbcRepository,
                           StoreRepository storeRepository,
                           @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.categoryRepository = categoryRepository;
        this.categoryJdbcRepository = categoryJdbcRepository;
        this.storeRepository = storeRepository;
        this.useJdbc = useJdbc;
    }

    public Category save(Category category) {
        if (category.getStore() == null && category.getStoreId() != null) {
            Store store = storeRepository.findById(category.getStoreId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
            category.setStore(store);
        }
        return useJdbc
                ? categoryJdbcRepository.save(category)
                : categoryRepository.save(category);
    }

    public Category update(Category category) {
        if (useJdbc) categoryJdbcRepository.update(category);
        else categoryRepository.save(category);
        return category;
    }

    public void delete(UUID id) {
        if (useJdbc) categoryJdbcRepository.delete(id);
        else categoryRepository.deleteById(id);
    }

    public Category findById(UUID id) {
        return useJdbc
                ? categoryJdbcRepository.findById(id).orElse(null)
                : categoryRepository.findById(id).orElse(null);
    }

    public Page<Category> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Category> list = categoryJdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return categoryRepository.findAll(pageable);
        }
    }

    public Page<Category> findAllByStore(UUID storeId, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Category> list = categoryJdbcRepository.findAllByStoreId(storeId, offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            Store store = new Store();
            store.setId(storeId);
            return categoryRepository.findAllByStore(store, pageable);
        }
    }
}
