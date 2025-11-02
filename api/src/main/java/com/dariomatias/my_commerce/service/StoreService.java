package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.StoreAdapter;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.util.UUID;

@Service
@Transactional
public class StoreService {

    private final StoreAdapter storeAdapter;
    private final UserAdapter userAdapter;

    public StoreService(StoreAdapter storeAdapter, UserAdapter userAdapter) {
        this.storeAdapter = storeAdapter;
        this.userAdapter = userAdapter;
    }

    public Store create(UUID userId, StoreRequestDTO request) {
        User user = getUserById(userId);

        Store store = new Store();
        store.setName(request.getName());
        store.setSlug(generateSlug(request.getName()));
        store.setDescription(request.getDescription());
        store.setBannerUrl(request.getBannerUrl());
        store.setLogoUrl(request.getLogoUrl());
        store.setThemeColor(request.getThemeColor());
        store.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
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
        checkAccess(store, user);
        return store;
    }

    public Store getBySlug(String slug) {
        return storeAdapter.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    public Store update(UUID id, StoreRequestDTO request, User user) {
        Store store = getStoreById(id);
        checkAccess(store, user);

        if (request.getName() != null && !request.getName().equals(store.getName())) {
            store.setName(request.getName());
            store.setSlug(generateSlug(request.getName()));
        }
        if (request.getDescription() != null) store.setDescription(request.getDescription());
        if (request.getBannerUrl() != null) store.setBannerUrl(request.getBannerUrl());
        if (request.getLogoUrl() != null) store.setLogoUrl(request.getLogoUrl());
        if (request.getThemeColor() != null) store.setThemeColor(request.getThemeColor());
        if (request.getIsActive() != null) store.setIsActive(request.getIsActive());

        return storeAdapter.update(store);
    }

    public void delete(UUID id, User user) {
        Store store = getStoreById(id);
        checkAccess(store, user);
        storeAdapter.delete(id);
    }

    private User getUserById(UUID id) {
        return userAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private Store getStoreById(UUID id) {
        return storeAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    private void checkAccess(Store store, User user) {
        if (user.getRole() != UserRole.ADMIN &&
                (store.getUser() == null || store.getUser().getEmail() == null ||
                        !store.getUser().getEmail().equalsIgnoreCase(user.getEmail()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
    }

    private String generateSlug(String name) {
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}
