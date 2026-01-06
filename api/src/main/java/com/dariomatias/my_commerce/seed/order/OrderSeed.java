package com.dariomatias.my_commerce.seed.order;

import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Component
public class OrderSeed {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    private final Random random = new Random();

    public OrderSeed(OrderRepository orderRepository, UserRepository userRepository, StoreRepository storeRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
    }

    @Transactional
    public void createOrders() {
        List<User> users = userRepository.findAll();
        List<Store> stores = storeRepository.findAll();

        if (users.isEmpty() || stores.isEmpty()) return;

        for (int i = 1; i <= 50; i++) {
            User user = users.get(random.nextInt(users.size()));
            Store store = stores.get(random.nextInt(stores.size()));

            Order order = new Order();
            order.setUser(user);
            order.setStore(store);
            order.setTotalAmount(BigDecimal.valueOf(random.nextDouble() * 500 + 50));
            order.setStatus(Status.PENDING);

            orderRepository.save(order);
        }
    }
}
