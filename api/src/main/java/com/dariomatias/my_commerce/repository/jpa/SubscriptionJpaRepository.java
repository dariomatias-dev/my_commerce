package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.repository.SubscriptionRepository;
import com.dariomatias.my_commerce.repository.contract.SubscriptionContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class SubscriptionJpaRepository implements SubscriptionContract {

    private final SubscriptionRepository repository;

    public SubscriptionJpaRepository(SubscriptionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Subscription save(Subscription subscription) {
        return repository.save(subscription);
    }

    @Override
    public Page<Subscription> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Subscription> findAllByUser_Id(UUID userId, Pageable pageable) {
        return repository.findAllByUser_Id(userId, pageable);
    }

    @Override
    public Optional<Subscription> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Subscription update(Subscription subscription) {
        return repository.save(subscription);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
