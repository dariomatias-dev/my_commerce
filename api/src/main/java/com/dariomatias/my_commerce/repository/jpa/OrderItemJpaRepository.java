package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.OrderItemRepository;
import com.dariomatias.my_commerce.repository.contract.OrderItemContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class OrderItemJpaRepository implements OrderItemContract {

    private final OrderItemRepository repository;

    public OrderItemJpaRepository(OrderItemRepository repository) {
        this.repository = repository;
    }

    @Override
    public OrderItem save(OrderItem item) {
        return repository.save(item);
    }

    @Override
    public Optional<OrderItem> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Page<OrderItem> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<OrderItem> findAllByOrderId(UUID orderId, Pageable pageable) {
        Order order = new Order();
        order.setId(orderId);
        return repository.findAllByOrder(order, pageable);
    }

    @Override
    public Page<OrderItem> findAllByProductId(UUID productId, Pageable pageable) {
        Product product = new Product();
        product.setId(productId);
        return repository.findAllByProduct(product, pageable);
    }

    @Override
    public OrderItem update(OrderItem item) {
        return repository.save(item);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
