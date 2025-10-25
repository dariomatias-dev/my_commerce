package com.dariomatias.my_commerce.seed.order_item;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.OrderItemRepository;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Component
public class OrderItemSeed {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    private final Random random = new Random();

    public OrderItemSeed(
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void createOrderItems() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();

        if (orders.isEmpty() || products.isEmpty()) return;

        for (Order order : orders) {
            int itemCount = random.nextInt(3) + 1;

            for (int i = 0; i < itemCount; i++) {
                Product product = products.get(random.nextInt(products.size()));

                int quantity = random.nextInt(5) + 1;
                BigDecimal unitPrice = BigDecimal.valueOf(product.getPrice());
                BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));

                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity(quantity);
                item.setPrice(totalPrice);

                orderItemRepository.save(item);
            }
        }
    }
}
