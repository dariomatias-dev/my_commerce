package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface SubscriptionPlanContract {

    SubscriptionPlan save(SubscriptionPlan plan);

    Optional<SubscriptionPlan> findById(UUID id);

    Page<SubscriptionPlan> findAll(Pageable pageable);

    boolean existsByName(String name);

    SubscriptionPlan update(SubscriptionPlan plan);

    void deleteById(UUID id);
}
