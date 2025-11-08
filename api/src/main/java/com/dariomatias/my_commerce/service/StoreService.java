package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.StoreAdapter;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
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

    private final StoreAdapter storeAdapter;
    private final UserAdapter userAdapter;
    private final MinioService minioService;

    private static final String BUCKET_NAME = "stores";

    public StoreService(StoreAdapter storeAdapter, UserAdapter userAdapter, MinioService minioService) {
        this.storeAdapter = storeAdapter;
        this.userAdapter = userAdapter;
        this.minioService = minioService;
    }

    public Store create(UUID userId, StoreRequestDTO request, MultipartFile logo, MultipartFile banner) {
        User user = getUserById(userId);
        String slug = SlugUtil.generateSlug(request.getName());

        minioService.createBucket(BUCKET_NAME);

        String folder = slug + "/";

        if (logo != null && !logo.isEmpty()) {
            String objectName = folder + "logo.jpeg";
            minioService.uploadFile(BUCKET_NAME, objectName, logo);
        }

        if (banner != null && !banner.isEmpty()) {
            String objectName = folder + "banner.jpeg";
            minioService.uploadFile(BUCKET_NAME, objectName, banner);
        }

        Store store = new Store();
        store.setName(request.getName());
        store.setSlug(slug);
        store.setDescription(request.getDescription());
        store.setThemeColor(request.getThemeColor());
        store.setIsActive(true);
        store.setUser(user);

        return storeAdapter.save(store);
    }

    public Page<Store> getAll(Pageable pageable) {
        return storeAdapter.findAll(pageable);
    }

    public Page<Store> getAllByUser(UUID userId, Pageable pageable) {
        User user = getUserById(userId);
        return storeAdapter.findAllByUser(user, pageable);
    }

    public Store getById(UUID id, User user) {
        Store store = getStoreById(id);
        checkAccess(user, store.getUser().getId());
        return store;
    }

    public Store getBySlug(String slug) {
        return storeAdapter.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    public Store update(UUID id, StoreRequestDTO request, User user, MultipartFile logo, MultipartFile banner) {
        Store store = getStoreById(id);
        checkAccess(user, store.getUser().getId());

        if (request != null) {
            if (request.getName() != null && !request.getName().equals(store.getName())) {
                store.setName(request.getName());
                store.setSlug(SlugUtil.generateSlug((request.getName())));
            }

            if (request.getDescription() != null) store.setDescription(request.getDescription());
            if (request.getThemeColor() != null) store.setThemeColor(request.getThemeColor());
        }

        String folder = store.getSlug() + "/";

        if (logo != null && !logo.isEmpty()) {
            String objectName = folder + "logo.jpeg";
            minioService.uploadFile(BUCKET_NAME, objectName, logo);
        }

        if (banner != null && !banner.isEmpty()) {
            String objectName = folder + "banner.jpeg";
            minioService.uploadFile(BUCKET_NAME, objectName, banner);
        }

        return storeAdapter.update(store);
    }

    public void delete(UUID id, User user) {
        Store store = getStoreById(id);
        checkAccess(user, store.getUser().getId());

        String folder = store.getSlug() + "/";

        storeAdapter.delete(id);

        minioService.deleteFolder(BUCKET_NAME, folder);
    }

    private User getUserById(UUID id) {
        return userAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private Store getStoreById(UUID id) {
        return storeAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    private void checkAccess(User user, UUID ownerId) {
        if (!UserRole.ADMIN.equals(user.getRole()) && !ownerId.equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
    }
}
