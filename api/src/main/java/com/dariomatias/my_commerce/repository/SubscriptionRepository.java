package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Page<Subscription> findAllByUser(User user, Pageable pageable);
}
