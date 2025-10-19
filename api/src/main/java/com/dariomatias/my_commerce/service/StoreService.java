package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.repository.adapter.StoreAdapter;
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
    private final UserRepository userRepository;

    public StoreService(StoreAdapter storeAdapter, UserRepository userRepository) {
        this.storeAdapter = storeAdapter;
        this.userRepository = userRepository;
    }

    public Store create(UUID ownerId, StoreRequestDTO request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Store entity = new Store();
        entity.setName(request.getName());
        entity.setSlug(generateSlug(request.getName()));
        entity.setDescription(request.getDescription());
        entity.setBannerUrl(request.getBannerUrl());
        entity.setLogoUrl(request.getLogoUrl());
        entity.setThemeColor(request.getThemeColor());
        entity.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        entity.setOwner(owner);

        return storeAdapter.save(entity);
    }

    public Page<Store> getAll(User user, Pageable pageable) {
        if ("ADMIN".equals(user.getRole())) {
            return storeAdapter.findAll(pageable);
        }
        return storeAdapter.findAllByOwner(user, pageable);
    }

    public Store getById(UUID id, User user) {
        Store entity = storeAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!"ADMIN".equals(user.getRole()) && !entity.getOwner().getEmail().equals(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        return entity;
    }

    public Store getBySlug(String slug) {
        return storeAdapter.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    public Store update(UUID id, StoreRequestDTO request, User user) {
        Store entity = storeAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!"ADMIN".equals(user.getRole()) && !entity.getOwner().getEmail().equals(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        if (request.getName() != null && !entity.getName().equals(request.getName())) {
            entity.setName(request.getName());
            entity.setSlug(generateSlug(request.getName()));
        }
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getBannerUrl() != null) entity.setBannerUrl(request.getBannerUrl());
        if (request.getLogoUrl() != null) entity.setLogoUrl(request.getLogoUrl());
        if (request.getThemeColor() != null) entity.setThemeColor(request.getThemeColor());
        if (request.getIsActive() != null) entity.setIsActive(request.getIsActive());

        return storeAdapter.update(entity);
    }

    public void delete(UUID id, User user) {
        Store entity = storeAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));

        if (!"ADMIN".equals(user.getRole()) && !entity.getOwner().getEmail().equals(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        storeAdapter.delete(id);
    }

    private String generateSlug(String name) {
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}
