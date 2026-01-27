package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.repository.specification.StoreSpecification;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class StoreJpaRepository implements StoreContract {

    private final StoreRepository repository;

    public StoreJpaRepository(StoreRepository repository) {
        this.repository = repository;
    }

    @Override
    public Store save(Store store) {
        return repository.save(store);
    }

    @Override
    public Page<Store> findAll(StoreFilterDTO filter, Pageable pageable) {
        Specification<Store> spec = (root, query, cb) -> null;

        spec = spec.and(StoreSpecification.user(filter.getUserId()));

        StatusFilter status = filter.getStatus() != null ? filter.getStatus() : StatusFilter.ACTIVE;

        if (status == StatusFilter.ACTIVE) {
            spec = spec.and(StoreSpecification.active());
        } else if (status == StatusFilter.DELETED) {
            spec = spec.and(StoreSpecification.deleted());
        }

        return repository.findAll(spec, pageable);
    }

    @Override
    public List<Store> findAllByUserId(UUID userId) {
        return repository.findAllByUser_Id(userId);
    }

    @Override
    public Optional<Store> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Store> findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    @Override
    public boolean existsBySlugAndDeletedAtIsNull(String slug) {
        return repository.existsBySlugAndDeletedAtIsNull(slug);
    }

    @Override
    public long countByIsActiveTrueAndDeletedAtIsNull() {
        return repository.countByIsActiveTrueAndDeletedAtIsNull();
    }

    @Override
    public Store update(Store store) {
        return repository.save(store);
    }

    @Override
    public void delete(Store store) {
        store.setIsActive(false);
        store.setDeletedAt(LocalDateTime.now());

        update(store);
    }

    @Override
    public void deleteByUserId(UUID userId) {
        repository.deleteByUserId(userId);
    }
}
