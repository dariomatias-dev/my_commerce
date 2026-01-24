package com.dariomatias.my_commerce.seed.category;

import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.seed.Seed;
import com.dariomatias.my_commerce.seed.admin_user.AdminUserSeed;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategorySeed implements Seed {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeed.class);

    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    public CategorySeed(CategoryRepository categoryRepository, StoreRepository storeRepository) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    @Transactional
    public void run() {
        log.info("CATEGORY_SEED | Iniciando criação de categorias");
        createCategories();
        log.info("CATEGORY_SEED | Finalizada criação de categorias");
    }

    @Transactional
    public void createCategories() {
        List<Store> stores = storeRepository.findAll();

        if (stores.isEmpty()) {
            log.warn("CATEGORY_SEED | Nenhuma loja encontrada, seed de categorias ignorado");

            return;
        }

        int categoryIndex = 1;

        for (Store store : stores) {
            int categoriesPerStore = 2 + (categoryIndex % 4);

            log.info(
                    "CATEGORY_SEED | Loja: {} | Categorias previstas: {}",
                    store.getName(),
                    categoriesPerStore
            );

            for (int i = 0; i < categoriesPerStore; i++) {
                String categoryName = "Categoria " + categoryIndex;

                if (categoryRepository.existsByStoreAndName(store, categoryName)) {
                    log.warn(
                            "CATEGORY_SEED | Categoria já existente: {} (Loja: {})",
                            categoryName,
                            store.getName()
                    );

                    categoryIndex++;

                    continue;
                }

                Category category = new Category();
                category.setName(categoryName);
                category.setStore(store);

                categoryRepository.save(category);

                log.info(
                        "CATEGORY_SEED | Categoria criada: {} (Loja: {})",
                        categoryName,
                        store.getName()
                );

                categoryIndex++;
            }
        }
    }
}
