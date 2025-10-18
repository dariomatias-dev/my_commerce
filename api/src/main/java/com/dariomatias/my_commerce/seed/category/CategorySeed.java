package com.dariomatias.my_commerce.seed.category;

import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import java.util.List;

@Component
public class CategorySeed {

    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    public CategorySeed(CategoryRepository categoryRepository, StoreRepository storeRepository) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    @Transactional
    public void createCategories() {
        List<Store> stores = storeRepository.findAll();
        if (stores.isEmpty()) return;

        for (int i = 1; i <= 20; i++) {
            Category category = new Category();
            category.setName("Categoria " + i);
            category.setStore(stores.get(i % stores.size()));
            categoryRepository.save(category);
        }
    }
}
