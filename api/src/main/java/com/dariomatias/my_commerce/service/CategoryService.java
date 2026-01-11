package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
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

    private final CategoryContract categoryRepository;
    private final StoreContract storeRepository;

    public CategoryService(CategoryContract categoryRepository, StoreContract storeRepository) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    public Category create(CategoryRequestDTO request) {
        Store store = getStoreOrThrow(request.getStoreId());

        Category category = new Category();
        category.setName(request.getName());
        category.setStore(store);

        return categoryRepository.save(category);
    }

    public Page<Category> getAll(CategoryFilterDTO filter, Pageable pageable) {
        if (filter == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filtro inválido");

        getStoreOrThrow(filter.getStoreId());

        return categoryRepository.findAll(
                filter,
                pageable
        );
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

        return categoryRepository.update(category);
    }

    public void delete(UUID id) {
        getById(id);
        categoryRepository.deleteById(id);
    }

    private Store getStoreOrThrow(UUID storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }
}
