package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class OrderJpaRepository implements OrderContract {

    private final OrderRepository repository;

    public OrderJpaRepository(OrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public Order save(Order order) {
        return repository.save(order);
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Order> getByIdWithItems(UUID id) {
        return repository.getByIdWithItems(id);
    }

    @Override
    public Page<Order> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Order> findAllByStoreId(UUID storeId, Pageable pageable) {
        Store store = new Store();
        store.setId(storeId);
        return repository.findAllByStore(store, pageable);
    }

    @Override
    public Page<Order> findAllByUserId(UUID userId, Pageable pageable) {
        User user = new User();
        user.setId(userId);
        return repository.findAllByUser(user, pageable);
    }

    @Override
    public Order update(Order order) {
        return repository.save(order);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
