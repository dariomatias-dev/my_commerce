package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface SubscriptionContract {

    Subscription save(Subscription subscription);

    Optional<Subscription> findById(UUID id);

    Page<Subscription> findAll(Pageable pageable);

    Page<Subscription> findAllByUser_Id(UUID userId, Pageable pageable);

    Subscription update(Subscription subscription);
}
