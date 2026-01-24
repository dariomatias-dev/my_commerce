package com.dariomatias.my_commerce.seed.order;

import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.*;
import com.dariomatias.my_commerce.seed.Seed;
import com.dariomatias.my_commerce.service.FreightService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class OrderSeed implements Seed {

    private static final Logger log = LoggerFactory.getLogger(OrderSeed.class);

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
        log.info("ORDER_SEED | Iniciando criação de pedidos");
        createOrders();
        log.info("ORDER_SEED | Finalizada criação de pedidos");
    }

    @Transactional
    public void createOrders() {
        List<User> users = userRepository.findAll();
        List<Store> stores = storeRepository.findAll();

        if (users.isEmpty() || stores.isEmpty()) {
            log.warn("ORDER_SEED | Usuários ou lojas não encontrados, seed ignorado");

            return;
        }

        for (User user : users) {
            List<UserAddress> addresses =
                    userAddressRepository.findAllByUser_IdAndDeletedAtIsNull(user.getId());

            if (addresses.isEmpty()) {
                log.warn("ORDER_SEED | Usuário sem endereços: {}", user.getEmail());

                continue;
            }

            int ordersPerUser = 1 + random.nextInt(12);

            log.info(
                    "ORDER_SEED | Criando {} pedidos para o usuário: {}",
                    ordersPerUser,
                    user.getEmail()
            );

            for (int i = 0; i < ordersPerUser; i++) {
                Store store = stores.get(random.nextInt(stores.size()));

                List<Product> storeProducts =
                        productRepository.findAllByStore_IdAndDeletedAtIsNull(store.getId());

                if (storeProducts.isEmpty()) {
                    log.warn(
                            "ORDER_SEED | Loja Removida: {}",
                            store.getName()
                    );

                    continue;
                }

                UserAddress userAddress = addresses.get(random.nextInt(addresses.size()));

                List<OrderItem> items = new ArrayList<>();
                int itemsCount = 1 + random.nextInt(4);

                for (int j = 0; j < itemsCount; j++) {
                    Product product = storeProducts.get(random.nextInt(storeProducts.size()));

                    OrderItem item = new OrderItem();
                    item.setProduct(product);
                    item.setQuantity(1 + random.nextInt(3));
                    item.setPrice(product.getPrice());

                    items.add(item);
                }

                if (items.isEmpty()) continue;

                Order order = new Order();
                order.setUser(user);
                order.setStore(store);
                order.setPaymentMethod(randomPaymentMethod());
                order.setFreightType(randomFreightType());
                order.setStatus(randomStatus());
                order.setItems(items);

                items.forEach(item -> item.setOrder(order));

                OrderAddress snapshot = snapshotAddress(userAddress);
                order.setAddress(snapshot);

                BigDecimal itemsAmount = items.stream()
                        .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                var freight = freightService.calculateFreight(userAddress.getId());

                BigDecimal freightAmount = order.getFreightType() == FreightType.ECONOMICAL
                        ? freight.getEconomical().getValue()
                        : freight.getExpress().getValue();

                order.setFreightAmount(freightAmount);

                order.setTotalAmount(itemsAmount.add(freightAmount));

                orderRepository.save(order);

                log.info(
                        "ORDER_SEED | Pedido criado | Usuário: {} | Loja: {} | Total: {} | Status: {}",
                        user.getEmail(),
                        store.getName(),
                        order.getTotalAmount(),
                        order.getStatus()
                );
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
