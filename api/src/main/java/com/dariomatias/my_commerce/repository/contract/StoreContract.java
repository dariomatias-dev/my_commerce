package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StoreContract {

    Store save(Store store);

    boolean existsBySlugAndDeletedAtIsNull(String slug);

    Page<Store> findAll(StoreFilterDTO filter, Pageable pageable);

    List<Store> findAllByUserId(UUID userId);

    Optional<Store> findById(UUID id);

    Optional<Store> findBySlug(String slug);

    long countByIsActiveTrueAndDeletedAtIsNull();

    Store update(Store store);

    void delete(Store store);

    void deleteByUserId(UUID userId);
}
