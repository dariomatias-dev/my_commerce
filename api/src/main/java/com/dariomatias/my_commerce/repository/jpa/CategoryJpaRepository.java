package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import com.dariomatias.my_commerce.repository.specification.CategorySpecification;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class CategoryJpaRepository implements CategoryContract {

    private final CategoryRepository repository;

    public CategoryJpaRepository(CategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public Category save(Category category) {
        return repository.save(category);
    }

    @Override
    public Page<Category> findAll(CategoryFilterDTO filter, Pageable pageable) {
        Specification<Category> spec = (root, query, cb) -> null;

        if (filter.getStoreId() != null) {
            spec = spec.and(CategorySpecification.store(filter.getStoreId()));
        }

        if (filter.getName() != null && !filter.getName().isBlank()) {
            spec = spec.and(CategorySpecification.name(filter.getName()));
        }

        return repository.findAll(spec, pageable);
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Category update(Category category) {
        return repository.save(category);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
