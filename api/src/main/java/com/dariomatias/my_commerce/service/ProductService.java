package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.util.SlugUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ProductService {

    private final ProductContract productRepository;
    private final StoreContract storeRepository;
    private final CategoryContract categoryRepository;
    private final MinioService minioService;
    private static final String BUCKET_NAME = "stores";

    public ProductService(ProductContract productRepository,
                          StoreContract storeRepository,
                          CategoryContract categoryRepository,
                          MinioService minioService) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
        this.minioService = minioService;
    }

    public Product create(User user, ProductRequestDTO request, MultipartFile[] images) {
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!user.getRole().equals(UserRole.ADMIN) && !store.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A loja não pertence ao usuário");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        if (!category.getStoreId().equals(store.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A categoria não pertence à loja informada");
        }

        String productSlug = SlugUtil.generateSlug(request.getName());
        Optional<Product> existingProduct = productRepository.findBySlug(productSlug);

        if (existingProduct.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um produto com este nome na loja");
        }

        Product product = new Product();
        product.setStore(store);
        product.setCategory(category);
        product.setName(request.getName());
        product.setSlug(productSlug);
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setActive(request.getActive());

        uploadProductImages(store, product, images);

        return productRepository.save(product);
    }

    public Page<Product> getAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> getAllByStore(UUID storeId, Pageable pageable) {
        return productRepository.findAllByStore(storeId, pageable);
    }

    public Page<Product> getAllByCategory(UUID categoryId, Pageable pageable) {
        return productRepository.findAllByCategory(categoryId, pageable);
    }

    public Product getById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public Product update(User user, UUID id, ProductRequestDTO request, MultipartFile[] images) {
        Product product = getById(id);

        Store store = storeRepository.findById(product.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!user.getRole().equals(UserRole.ADMIN) && !store.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));

            if (!category.getStoreId().equals(store.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A categoria não pertence à loja");
            }

            product.setCategoryId(category.getId());
        }

        if (request.getName() != null && !request.getName().equals(product.getName())) {
            String newSlug = SlugUtil.generateSlug(request.getName());
            Optional<Product> existingProduct = productRepository.findBySlug(newSlug);

            if (existingProduct.isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um produto com este nome na loja");
            }

            product.setName(request.getName());
            product.setSlug(newSlug);
        }

        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getActive() != null) product.setActive(request.getActive());

        uploadProductImages(store, product, images);

        return productRepository.update(product);
    }

    public void delete(User user, UUID id) {
        Product product = getById(id);

        Store store = storeRepository.findById(product.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!user.getRole().equals(UserRole.ADMIN) && !store.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        productRepository.deleteById(id);
    }

    private void uploadProductImages(Store store, Product product, MultipartFile[] images) {
        if (images == null || images.length == 0) return;

        String folder = store.getSlug() + "/products/" + product.getSlug() + "/";

        for (int i = 0; i < images.length; i++) {
            String objectName = folder + "image_" + (i + 1) + ".jpeg";
            minioService.uploadFile(BUCKET_NAME, objectName, images[i]);
        }
    }
}
