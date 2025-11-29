package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface StoreContract {

    Store save(Store store);

    Store update(Store store);

    void delete(UUID id);

    Optional<Store> findById(UUID id);

    Optional<Store> findBySlug(String slug);

    Page<Store> findAll(Pageable pageable);

    Page<Store> findAllByUser(UUID userId, Pageable pageable);

    boolean existsBySlug(String slug);

    void deactivateByUserId(UUID userId);
}
