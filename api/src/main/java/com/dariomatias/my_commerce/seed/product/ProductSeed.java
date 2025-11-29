package com.dariomatias.my_commerce.seed.product;

import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.util.SlugUtil;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import java.util.List;

@Component
public class ProductSeed {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    public ProductSeed(
            ProductRepository productRepository,
            StoreRepository storeRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public void createProducts() {
        List<Store> stores = storeRepository.findAll();
        List<Category> categories = categoryRepository.findAll();

        if (stores.isEmpty() || categories.isEmpty()) return;

        for (int i = 1; i <= 20; i++) {
            Product product = new Product();
            product.setStore(stores.get(i % stores.size()));
            product.setCategory(categories.get(i % categories.size()));

            String name = "Produto " + i;
            product.setName(name);
            product.setSlug(SlugUtil.generateSlug(name));

            product.setDescription("Descrição do produto " + i);
            product.setPrice(49.90 + i);
            product.setStock(20 + i);
            product.setActive(true);

            productRepository.save(product);
        }
    }
}
