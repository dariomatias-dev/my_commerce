package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.jdbc.StoreJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class StoreAdapter {

    private final StoreRepository storeRepository;
    private final StoreJdbcRepository storeJdbcRepository;
    private final boolean useJdbc;

    public StoreAdapter(StoreRepository storeRepository,
                        StoreJdbcRepository storeJdbcRepository,
                        @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.storeRepository = storeRepository;
        this.storeJdbcRepository = storeJdbcRepository;
        this.useJdbc = useJdbc;
    }

    public Store save(Store store) {
        checkSlugUnique(store.getSlug(), null);
        return useJdbc ? storeJdbcRepository.save(store) : storeRepository.save(store);
    }

    public Store update(Store store) {
        checkSlugUnique(store.getSlug(), store.getId());
        if (useJdbc) storeJdbcRepository.update(store);
        else storeRepository.save(store);
        return store;
    }

    private void checkSlugUnique(String slug, UUID storeId) {
        boolean exists;
        if (useJdbc) {
            Optional<Store> existing = storeJdbcRepository.findBySlug(slug);
            exists = existing.isPresent() && (storeId == null || !existing.get().getId().equals(storeId));
        } else {
            Optional<Store> existing = storeRepository.findBySlug(slug);
            exists = existing.isPresent() && (storeId == null || !existing.get().getId().equals(storeId));
        }
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome da loja já está em uso");
        }
    }

    public Page<Store> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Store> list = storeJdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return storeRepository.findAll(pageable);
        }
    }

    public Page<Store> findAllByOwner(User user, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Store> list = storeJdbcRepository.findAllByOwnerId(user.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return storeRepository.findAllByOwnerId(user.getId(), pageable);
        }
    }

    public Optional<Store> findById(UUID id) {
        return useJdbc ? storeJdbcRepository.findById(id) : storeRepository.findById(id);
    }

    public Optional<Store> findBySlug(String slug) {
        return useJdbc ? storeJdbcRepository.findBySlug(slug) : storeRepository.findBySlug(slug);
    }

    public void delete(UUID id) {
        if (useJdbc) storeJdbcRepository.delete(id);
        else storeRepository.deleteById(id);
    }
}
