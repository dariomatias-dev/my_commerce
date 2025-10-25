package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.adapter.OrderAdapter;
import com.dariomatias.my_commerce.repository.adapter.OrderItemAdapter;
import com.dariomatias.my_commerce.repository.adapter.ProductAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@Transactional
public class OrderItemService {

    private final OrderItemAdapter itemAdapter;
    private final OrderAdapter orderAdapter;
    private final ProductAdapter productAdapter;

    public OrderItemService(OrderItemAdapter itemAdapter,
                            OrderAdapter orderAdapter,
                            ProductAdapter productAdapter) {
        this.itemAdapter = itemAdapter;
        this.orderAdapter = orderAdapter;
        this.productAdapter = productAdapter;
    }

    public OrderItem create(OrderItemRequestDTO request) {
        Order order = orderAdapter.findById(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        Product product = productAdapter.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());
        item.setPrice(request.getPrice());

        return itemAdapter.save(item);
    }

    public OrderItem getById(UUID id) {
        return itemAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));
    }

    public Page<OrderItem> getAll(Pageable pageable) {
        return itemAdapter.findAll(pageable);
    }

    public Page<OrderItem> getAllByOrder(UUID orderId, Pageable pageable) {
        Order order = orderAdapter.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        return itemAdapter.findAllByOrder(order, pageable);
    }

    public Page<OrderItem> getAllByProduct(UUID productId, Pageable pageable) {
        Product product = productAdapter.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        return itemAdapter.findAllByProduct(product, pageable);
    }

    public OrderItem update(UUID id, UUID orderId, UUID productId, Integer quantity, BigDecimal price) {
        OrderItem item = getById(id);

        if (orderId != null) {
            Order order = orderAdapter.findById(orderId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
            item.setOrder(order);
        }

        if (productId != null) {
            Product product = productAdapter.findById(productId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
            item.setProduct(product);
        }

        if (quantity != null) item.setQuantity(quantity);
        if (price != null) item.setPrice(price);

        return itemAdapter.update(item);
    }

    public void delete(UUID id) {
        itemAdapter.delete(id);
    }
}
