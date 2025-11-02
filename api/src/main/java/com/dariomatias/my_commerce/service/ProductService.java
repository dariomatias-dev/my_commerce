package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.CategoryAdapter;
import com.dariomatias.my_commerce.repository.adapter.ProductAdapter;
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
public class ProductService {

    private final ProductAdapter productAdapter;
    private final StoreAdapter storeAdapter;
    private final CategoryAdapter categoryAdapter;

    public ProductService(ProductAdapter productAdapter,
                          StoreAdapter storeAdapter,
                          CategoryAdapter categoryAdapter) {
        this.productAdapter = productAdapter;
        this.storeAdapter = storeAdapter;
        this.categoryAdapter = categoryAdapter;
    }

    public Product create(User user, ProductRequestDTO request) {
        Store store = storeAdapter.findById(request.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!"ADMIN".equals(user.getRole()) && !store.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        Category category = categoryAdapter.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        Product product = new Product();
        product.setStore(store);
        product.setCategory(category);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setActive(request.getActive());
        product.setImages(request.getImages());

        return productAdapter.save(product);
    }

    public Page<Product> getAll(Pageable pageable) {
        return productAdapter.findAll(pageable);
    }

    public Page<Product> getAllByStore(UUID storeId, Pageable pageable) {
        return productAdapter.findAllByStore(storeId, pageable);
    }

    public Page<Product> getAllByCategory(UUID categoryId, Pageable pageable) {
        return productAdapter.findAllByCategory(categoryId, pageable);
    }

    public Product getById(UUID id) {
        return productAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public Product update(User user, UUID id, ProductRequestDTO request) {
        Product product = getById(id);

        if (!"ADMIN".equals(user.getRole()) && !product.getStore().getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getActive() != null) product.setActive(request.getActive());
        if (request.getImages() != null) product.setImages(request.getImages());

        return productAdapter.update(product);
    }

    public void delete(User user, UUID id) {
        Product product = getById(id);

        if (!"ADMIN".equals(user.getRole()) && !product.getStore().getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        productAdapter.delete(id);
    }
}
