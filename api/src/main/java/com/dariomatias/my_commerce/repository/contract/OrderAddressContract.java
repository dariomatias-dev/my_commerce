package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.OrderAddress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface OrderAddressContract {

    OrderAddress save(OrderAddress orderAddress);

    Optional<OrderAddress> findById(UUID id);

    Page<OrderAddress> findAll(Pageable pageable);

    OrderAddress update(OrderAddress orderAddress);

    void deleteById(UUID id);
}
