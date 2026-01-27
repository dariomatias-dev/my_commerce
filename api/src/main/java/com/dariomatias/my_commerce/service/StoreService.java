package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.repository.contract.SubscriptionContract;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import com.dariomatias.my_commerce.util.SlugUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional
public class StoreService {

    private final StoreContract storeRepository;
    private final SubscriptionContract subscriptionRepository;
    private final UserContract userRepository;
    private final MinioService minioService;

    private static final String BUCKET_NAME = "stores";

    public StoreService(
            StoreContract storeRepository,
            SubscriptionContract subscriptionRepository,
            UserContract userRepository,
            MinioService minioService
    ) {
        this.storeRepository = storeRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.minioService = minioService;
    }

    public Store create(User user, StoreRequestDTO request, MultipartFile logo, MultipartFile banner) {
        if (!subscriptionRepository.existsActiveSubscriptionByUserId(user.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "O usuário não possue uma assinatura ativa");
        }

        String slug = SlugUtil.generateSlug(request.getName());

        if (storeRepository.existsBySlugAndDeletedAtIsNull(slug)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma loja registrada com esse nome"
            );
        }

        minioService.createBucket(BUCKET_NAME);
        String folder = slug + "/";

        if (logo != null && !logo.isEmpty()) {
            minioService.uploadFile(BUCKET_NAME, folder + "logo.jpeg", logo);
        }

        if (banner != null && !banner.isEmpty()) {
            minioService.uploadFile(BUCKET_NAME, folder + "banner.jpeg", banner);
        }

        Store store = new Store();
        store.setName(request.getName());
        store.setSlug(slug);
        store.setDescription(request.getDescription());
        store.setThemeColor(request.getThemeColor());
        store.setIsActive(true);
        store.setUser(getUserById(user.getId()));

        return storeRepository.save(store);
    }

    public Page<Store> getAllStores(User authUser, StoreFilterDTO filter, Pageable pageable) {
        if (filter == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filtro obrigatório");
        }

        if (filter.getStatus() == StatusFilter.DELETED || filter.getStatus() == StatusFilter.ALL) {
            if (!authUser.getRole().equals(UserRole.ADMIN)
                    && !authUser.getRole().equals(UserRole.SUBSCRIBER)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Acesso negado para filtragem por status"
                );
            }
        }

        return storeRepository.findAll(filter, pageable);
    }

    public Store getById(UUID id, User user) {
        Store store = getStoreById(id);
        checkAccess(user, store.getUser().getId());

        return store;
    }

    public Store getBySlug(String slug) {
        return storeRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada")
                );
    }

    public long getActiveStoresCount() {
        return storeRepository.countByIsActiveTrueAndDeletedAtIsNull();
    }

    public Store update(UUID id, StoreRequestDTO request, User user, MultipartFile logo, MultipartFile banner) {
        Store store = getStoreById(id);
        checkAccess(user, store.getUser().getId());

        if (request != null) {
            if (request.getName() != null && !request.getName().equals(store.getName())) {
                String newSlug = SlugUtil.generateSlug(request.getName());

                if (storeRepository.existsBySlugAndDeletedAtIsNull(newSlug)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "O nome da loja já está em uso.");
                }

                store.setName(request.getName());
                store.setSlug(newSlug);
            }

            if (request.getDescription() != null) {
                store.setDescription(request.getDescription());
            }

            if (request.getThemeColor() != null) {
                store.setThemeColor(request.getThemeColor());
            }
        }

        String folder = store.getSlug() + "/";

        if (logo != null && !logo.isEmpty()) {
            minioService.uploadFile(BUCKET_NAME, folder + "logo.jpeg", logo);
        }

        if (banner != null && !banner.isEmpty()) {
            minioService.uploadFile(BUCKET_NAME, folder + "banner.jpeg", banner);
        }

        return storeRepository.update(store);
    }

    public void delete(UUID id, User user) {
        Store store = getStoreById(id);
        checkAccess(user, store.getUserId());

        String folder = store.getSlug() + "/";

        storeRepository.delete(store);

        minioService.deleteFolder(BUCKET_NAME, folder);
    }

    private User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private Store getStoreById(UUID id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    private void checkAccess(User user, UUID ownerId) {
        if (!UserRole.ADMIN.equals(user.getRole()) && !ownerId.equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
    }
}
