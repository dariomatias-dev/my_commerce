package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

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
    public Page<Store> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Store> findAllByUser(UUID userId, Pageable pageable) {
        User user = new User();
        user.setId(userId);
        return repository.findAllByUser(user, pageable);
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
    public Store update(Store store) {
        return repository.save(store);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
