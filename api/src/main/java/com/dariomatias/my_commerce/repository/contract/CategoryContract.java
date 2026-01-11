package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface CategoryContract {

    Category save(Category category);

    Optional<Category> findById(UUID id);

    Page<Category> findAll(CategoryFilterDTO filter, Pageable pageable);

    Category update(Category category);

    void deleteById(UUID id);
}
