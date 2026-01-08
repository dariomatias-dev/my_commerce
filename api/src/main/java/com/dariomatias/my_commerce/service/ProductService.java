package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.util.SlugUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ProductService {

    private final ProductContract productRepository;
    private final StoreContract storeRepository;
    private final CategoryContract categoryRepository;
    private final ProductImageService productImageService;
    private final VisitorTrackingService visitorTrackingService;

    public ProductService(
            ProductContract productRepository,
            StoreContract storeRepository,
            CategoryContract categoryRepository,
            ProductImageService productImageService,
            VisitorTrackingService visitorTrackingService
    ) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
        this.productImageService = productImageService;
        this.visitorTrackingService = visitorTrackingService;
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

        Optional<Product> existing =
                productRepository.findByStoreSlugAndProductSlug(store.getSlug(), productSlug);

        if (existing.isPresent()) {
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

        productRepository.save(product);

        productImageService.upload(store.getSlug(), product, images);

        return productRepository.update(product);
    }

    public Page<Product> getAllByStore(
            User user,
            ProductFilterDTO filter,
            Pageable pageable
    ) {
        StatusFilter status = (filter != null && filter.getStatus() != null)
                ? filter.getStatus()
                : StatusFilter.ACTIVE;

        if ((status == StatusFilter.DELETED || status == StatusFilter.ALL)
                && !user.getRole().equals(UserRole.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado para filtragem por status");
        }

        if (filter == null) {
            filter = new ProductFilterDTO();
        }
        filter.setStatus(status);

        return productRepository.findAll(filter, pageable);
    }

    public Page<Product> getActiveProductsByStoreAndIds(
            UUID storeId,
            List<UUID> productIds,
            Pageable pageable
    ) {
        Store store = storeRepository.findById(storeId)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada ou excluída"));

        if (productIds == null || productIds.isEmpty()) {
            return Page.empty(pageable);
        }

        return productRepository.findAllByStoreIdAndIdInAndDeletedAtIsNull(store.getId(), productIds, pageable);
    }

    public Product getByStoreSlugAndProductSlug(String storeSlug, String productSlug) {
        Store store = storeRepository.findBySlug(storeSlug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        visitorTrackingService.registerVisit(store.getId());

        return productRepository.findByStoreSlugAndProductSlug(store.getSlug(), productSlug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public Product getById(User user, UUID id) {
        if (user.getRole().equals(UserRole.ADMIN)) {
            return productRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        } else {
            return productRepository.findByIdAndDeletedAtIsNull(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        }
    }

    public long getUserActiveProductsCount(User user) {
        return productRepository.countByStoreUserIdAndActiveTrueAndDeletedAtIsNull(user.getId());
    }

    public long getActiveProductsCount(UUID storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        return productRepository.countByStoreIdAndActiveTrue(store.getId());
    }

    public Product update(
            User user,
            UUID id,
            ProductRequestDTO request,
            MultipartFile[] newImages
    ) {

        Product product = getActiveProductOrThrow(id);

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

            product.setCategory(category);
        }

        if (request.getName() != null && !request.getName().equals(product.getName())) {

            String newSlug = SlugUtil.generateSlug(request.getName());

            Optional<Product> existing =
                    productRepository.findByStoreSlugAndProductSlug(store.getSlug(), newSlug);

            if (existing.isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um produto com este nome na loja");
            }

            productImageService.rename(
                    store.getSlug(),
                    product.getSlug(),
                    newSlug
            );

            product.setName(request.getName());
            product.setSlug(newSlug);
        }

        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getActive() != null) product.setActive(request.getActive());

        productImageService.removeImages(
                product,
                request.getRemovedImageNames()
        );

        productImageService.upload(store.getSlug(), product, newImages);

        return productRepository.update(product);
    }

    @Transactional
    public void delete(User user, UUID id) {
        Product product = getActiveProductOrThrow(id);

        Store store = storeRepository.findById(product.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!user.getRole().equals(UserRole.ADMIN) && !store.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        productImageService.removeImages(
                product,
                product.getImages()
                        .stream()
                        .map(ProductImage::getUrl)
                        .toList()
        );

        productRepository.delete(product.getId());
    }

    private Product getActiveProductOrThrow(UUID id) {
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }
}
