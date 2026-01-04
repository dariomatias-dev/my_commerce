package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface OrderContract {

    Order save(Order order);

    Optional<Order> findById(UUID id);

    Optional<Order> getByIdWithItems(UUID id);

    Page<Order> findAll(Pageable pageable);

    Page<Order> findAllByStoreId(UUID storeId, Pageable pageable);

    Page<Order> findAllByUserId(UUID userId, Pageable pageable);

    Page<Store> findStoresWithOrdersByUserId(UUID userId, Pageable pageable);

    Page<Order> findAllByUserIdAndStoreId(
            UUID userId,
            UUID storeId,
            Pageable pageable
    );

    long countByStoreIdAndStatus(UUID storeId, String status);

    Order update(Order order);

    void deleteById(UUID id);
}
