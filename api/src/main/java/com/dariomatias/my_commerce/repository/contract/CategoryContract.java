package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface CategoryContract {

    Category save(Category category);

    Category update(Category category);

    void delete(UUID id);

    Optional<Category> findById(UUID id);

    Page<Category> findAll(Pageable pageable);

    Page<Category> findAllByStoreId(UUID storeId, Pageable pageable);
}
