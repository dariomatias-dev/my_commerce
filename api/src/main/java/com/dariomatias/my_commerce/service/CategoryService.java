package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    public CategoryService(CategoryRepository categoryRepository, StoreRepository storeRepository) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    public Category create(CategoryRequestDTO request) {
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        Category category = new Category();
        category.setStore(store);
        category.setName(request.getName());

        return categoryRepository.save(category);
    }

    public Page<Category> getAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Page<Category> getAllByStore(UUID storeId, Pageable pageable) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
        return categoryRepository.findAllByStore(store, pageable);
    }

    public Category getById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }

    public Category update(UUID id, CategoryRequestDTO request) {
        Category category = getById(id);

        if (request.getName() != null) {
            category.setName(request.getName());
        }

        return categoryRepository.save(category);
    }

    public void delete(UUID id) {
        Category category = getById(id);
        categoryRepository.delete(category);
    }
}
