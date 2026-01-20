package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.OrderAddress;
import com.dariomatias.my_commerce.repository.OrderAddressRepository;
import com.dariomatias.my_commerce.repository.contract.OrderAddressContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class OrderAddressJpaRepository implements OrderAddressContract {

    private final OrderAddressRepository repository;

    public OrderAddressJpaRepository(OrderAddressRepository repository) {
        this.repository = repository;
    }

    @Override
    public OrderAddress save(OrderAddress orderAddress) {
        return repository.save(orderAddress);
    }

    @Override
    public Optional<OrderAddress> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Page<OrderAddress> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public OrderAddress update(OrderAddress orderAddress) {
        return repository.save(orderAddress);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
