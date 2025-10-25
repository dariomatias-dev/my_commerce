package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.OrderItemRepository;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.jdbc.OrderItemJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OrderItemAdapter {

    private final OrderItemRepository repository;
    private final OrderItemJdbcRepository jdbcRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final boolean useJdbc;

    public OrderItemAdapter(OrderItemRepository repository,
                            OrderItemJdbcRepository jdbcRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository,
                            @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.repository = repository;
        this.jdbcRepository = jdbcRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.useJdbc = useJdbc;
    }

    public OrderItem save(OrderItem item) {
        if (item.getOrder() == null && item.getOrderId() != null) {
            Order order = orderRepository.findById(item.getOrderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
            item.setOrder(order);
        }

        if (item.getProduct() == null && item.getProductId() != null) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
            item.setProduct(product);
        }

        return useJdbc ? jdbcRepository.save(item) : repository.save(item);
    }

    public Optional<OrderItem> findById(UUID id) {
        return useJdbc ? jdbcRepository.findById(id) : repository.findById(id);
    }

    public Page<OrderItem> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<OrderItem> list = jdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAll(pageable);
        }
    }

    public Page<OrderItem> findAllByOrder(Order order, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<OrderItem> list = jdbcRepository.findAllByOrderId(order.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAllByOrder(order, pageable);
        }
    }

    public Page<OrderItem> findAllByProduct(Product product, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<OrderItem> list = jdbcRepository.findAllByProductId(product.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAllByProduct(product, pageable);
        }
    }

    public OrderItem update(OrderItem item) {
        if (useJdbc) jdbcRepository.update(item);
        else repository.save(item);
        return item;
    }

    public void delete(UUID id) {
        if (useJdbc) jdbcRepository.deleteById(id);
        else repository.deleteById(id);
    }
}
