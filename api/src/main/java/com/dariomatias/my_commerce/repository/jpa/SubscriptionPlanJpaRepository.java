package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
import com.dariomatias.my_commerce.repository.contract.SubscriptionPlanContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class SubscriptionPlanJpaRepository implements SubscriptionPlanContract {

    private final SubscriptionPlanRepository repository;

    public SubscriptionPlanJpaRepository(SubscriptionPlanRepository repository) {
        this.repository = repository;
    }

    @Override
    public SubscriptionPlan save(SubscriptionPlan plan) {
        return repository.save(plan);
    }

    @Override
    public SubscriptionPlan update(SubscriptionPlan plan) {
        return repository.save(plan);
    }

    @Override
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<SubscriptionPlan> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Page<SubscriptionPlan> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public boolean existsByName(String name) {
        return repository.existsByName(name);
    }
}
