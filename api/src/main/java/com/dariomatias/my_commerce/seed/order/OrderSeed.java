package com.dariomatias.my_commerce.seed.order;

import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.*;
import com.dariomatias.my_commerce.seed.Seed;
import com.dariomatias.my_commerce.service.FreightService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class OrderSeed implements Seed {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final UserAddressRepository userAddressRepository;
    private final FreightService freightService;

    private final Random random = new Random();

    public OrderSeed(
            OrderRepository orderRepository,
            UserRepository userRepository,
            StoreRepository storeRepository,
            ProductRepository productRepository,
            UserAddressRepository userAddressRepository,
            FreightService freightService
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.userAddressRepository = userAddressRepository;
        this.freightService = freightService;
    }

    @Override
    @Transactional
    public void run() {
        createOrders();
    }

    @Transactional
    public void createOrders() {
        List<User> users = userRepository.findAll();
        List<Store> stores = storeRepository.findAll();

        if (users.isEmpty() || stores.isEmpty()) return;

        for (User user : users) {
            List<UserAddress> addresses =
                    userAddressRepository.findAllByUserIdAndDeletedAtIsNull(user.getId());

            if (addresses.isEmpty()) continue;

            int ordersPerUser = 1 + random.nextInt(12);

            for (int i = 0; i < ordersPerUser; i++) {
                Store store = stores.get(random.nextInt(stores.size()));

                List<Product> storeProducts =
                        productRepository.findAllByStore_IdAndDeletedAtIsNull(store.getId());

                if (storeProducts.isEmpty()) continue;

                UserAddress userAddress = addresses.get(random.nextInt(addresses.size()));

                Order order = new Order();
                order.setUser(user);
                order.setStore(store);
                order.setPaymentMethod(randomPaymentMethod());
                order.setFreightType(randomFreightType());
                order.setStatus(randomStatus());
                order.setItems(new ArrayList<>());

                OrderAddress snapshot = snapshotAddress(userAddress);
                order.setAddress(snapshot);

                BigDecimal itemsAmount = BigDecimal.ZERO;
                int itemsCount = 1 + random.nextInt(4);

                for (int j = 0; j < itemsCount; j++) {
                    Product product =
                            storeProducts.get(random.nextInt(storeProducts.size()));

                    OrderItem item = new OrderItem();
                    item.setOrder(order);
                    item.setProduct(product);
                    item.setQuantity(1 + random.nextInt(3));
                    item.setPrice(product.getPrice());

                    itemsAmount = itemsAmount.add(
                            product.getPrice()
                                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    );

                    order.getItems().add(item);
                }

                var freight = freightService.calculateFreight(userAddress.getId());

                if (order.getFreightType() == FreightType.ECONOMICAL) {
                    order.setFreightAmount(freight.getEconomical().getValue());
                } else {
                    order.setFreightAmount(freight.getExpress().getValue());
                }

                order.setTotalAmount(itemsAmount.add(order.getFreightAmount()));

                orderRepository.save(order);
            }
        }
    }

    private OrderAddress snapshotAddress(UserAddress address) {
        OrderAddress snapshot = new OrderAddress();
        snapshot.setLabel(address.getLabel());
        snapshot.setStreet(address.getStreet());
        snapshot.setNumber(address.getNumber());
        snapshot.setComplement(address.getComplement());
        snapshot.setNeighborhood(address.getNeighborhood());
        snapshot.setCity(address.getCity());
        snapshot.setState(address.getState());
        snapshot.setZip(address.getZip());
        snapshot.setLocation(address.getLocation());
        return snapshot;
    }

    private PaymentMethod randomPaymentMethod() {
        PaymentMethod[] values = PaymentMethod.values();
        return values[random.nextInt(values.length)];
    }

    private FreightType randomFreightType() {
        return random.nextBoolean()
                ? FreightType.ECONOMICAL
                : FreightType.EXPRESS;
    }

    private Status randomStatus() {
        int roll = random.nextInt(100);

        if (roll < 10) return Status.FAILED;
        if (roll < 20) return Status.CANCELED;
        if (roll < 40) return Status.PENDING;
        if (roll < 60) return Status.CONFIRMED;
        if (roll < 80) return Status.PROCESSING;
        return Status.COMPLETED;
    }
}
