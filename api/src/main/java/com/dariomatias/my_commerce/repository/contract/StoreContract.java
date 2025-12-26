package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface StoreContract {

    Store save(Store store);

    boolean existsBySlug(String slug);

    Page<Store> findAll(Pageable pageable);

    Page<Store> findAllByUser(UUID userId, Pageable pageable);

    Optional<Store> findById(UUID id);

    Optional<Store> findBySlug(String slug);

    Store update(Store store);

    void deleteById(UUID id);
}
