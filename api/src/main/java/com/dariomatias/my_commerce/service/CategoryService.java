package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.adapter.CategoryAdapter;
import com.dariomatias.my_commerce.repository.adapter.StoreAdapter;
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

    private final CategoryAdapter categoryAdapter;
    private final StoreAdapter storeAdapter;

    public CategoryService(CategoryAdapter categoryAdapter, StoreAdapter storeAdapter) {
        this.categoryAdapter = categoryAdapter;
        this.storeAdapter = storeAdapter;
    }

    public Category create(CategoryRequestDTO request) {
        Store store = getStoreOrThrow(request.getStoreId());
        Category category = new Category();
        category.setName(request.getName());
        category.setStoreId(store.getId());
        return categoryAdapter.save(category);
    }

    public Page<Category> getAll(Pageable pageable) {
        return categoryAdapter.findAll(pageable);
    }

    public Page<Category> getAllByStore(UUID storeId, Pageable pageable) {
        getStoreOrThrow(storeId);
        return categoryAdapter.findAllByStore(storeId, pageable);
    }

    public Category getById(UUID id) {
        return categoryAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }

    public Category update(UUID id, CategoryRequestDTO request) {
        Category category = getById(id);
        if (request.getName() != null) category.setName(request.getName());
        return categoryAdapter.update(category);
    }

    public void delete(UUID id) {
        getById(id);
        categoryAdapter.delete(id);
    }

    private Store getStoreOrThrow(UUID storeId) {
        return storeAdapter.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }
}
