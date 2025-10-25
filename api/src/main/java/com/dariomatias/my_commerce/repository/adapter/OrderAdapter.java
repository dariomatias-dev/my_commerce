package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.repository.jdbc.OrderJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OrderAdapter {

    private final OrderRepository orderRepository;
    private final OrderJdbcRepository orderJdbcRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final boolean useJdbc;

    public OrderAdapter(OrderRepository orderRepository,
                        OrderJdbcRepository orderJdbcRepository,
                        StoreRepository storeRepository,
                        UserRepository userRepository,
                        @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.orderRepository = orderRepository;
        this.orderJdbcRepository = orderJdbcRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.useJdbc = useJdbc;
    }

    public Order save(Order order) {
        if (order.getStore() == null && order.getStoreId() != null) {
            Store store = storeRepository.findById(order.getStoreId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
            order.setStore(store);
        }

        if (order.getUser() == null && order.getUserId() != null) {
            User user = userRepository.findById(order.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
            order.setUser(user);
        }

        return useJdbc ? orderJdbcRepository.save(order) : orderRepository.save(order);
    }

    public Optional<Order> findById(UUID id) {
        return useJdbc ? orderJdbcRepository.findById(id) : orderRepository.findById(id);
    }

    public Page<Order> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Order> list = orderJdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return orderRepository.findAll(pageable);
        }
    }

    public Page<Order> findAllByStore(Store store, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Order> list = orderJdbcRepository.findAllByStoreId(store.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return orderRepository.findAllByStore(store, pageable);
        }
    }

    public Page<Order> findAllByUser(User user, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Order> list = orderJdbcRepository.findAllByUserId(user.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return orderRepository.findAllByUser(user, pageable);
        }
    }

    public Order update(Order order) {
        if (useJdbc) orderJdbcRepository.update(order);
        else orderRepository.save(order);

        return order;
    }

    public void delete(UUID id) {
        if (useJdbc) orderJdbcRepository.deleteById(id);
        else orderRepository.deleteById(id);
    }
}
