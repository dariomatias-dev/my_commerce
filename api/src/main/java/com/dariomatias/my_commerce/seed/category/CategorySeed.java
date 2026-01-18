package com.dariomatias.my_commerce.seed.category;

import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.seed.Seed;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategorySeed implements Seed {

    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    public CategorySeed(CategoryRepository categoryRepository, StoreRepository storeRepository) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    @Transactional
    public void run() {
        createCategories();
    }

    @Transactional
    public void createCategories() {
        List<Store> stores = storeRepository.findAll();
        if (stores.isEmpty()) return;

        int categoryIndex = 1;

        for (Store store : stores) {
            int categoriesPerStore = 2 + (categoryIndex % 4);

            for (int i = 0; i < categoriesPerStore; i++) {
                Category category = new Category();
                category.setName("Categoria " + categoryIndex);
                category.setStore(store);

                categoryRepository.save(category);
                categoryIndex++;
            }
        }
    }
}
