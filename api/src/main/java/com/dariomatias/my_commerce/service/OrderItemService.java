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
        OrderItem item = new OrderItem();
        item.setOrder(getOrderOrThrow(request.getOrderId()));
        item.setProduct(getProductOrThrow(request.getProductId()));
        item.setQuantity(request.getQuantity());
        item.setPrice(request.getPrice());
        return itemAdapter.save(item);
    }

    public Page<OrderItem> getAll(Pageable pageable) {
        return itemAdapter.findAll(pageable);
    }

    public Page<OrderItem> getAllByOrder(UUID orderId, Pageable pageable) {
        return itemAdapter.findAllByOrder(getOrderOrThrow(orderId), pageable);
    }

    public Page<OrderItem> getAllByProduct(UUID productId, Pageable pageable) {
        return itemAdapter.findAllByProduct(getProductOrThrow(productId), pageable);
    }

    public OrderItem getById(UUID id) {
        return itemAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));
    }

    public OrderItem update(UUID id, OrderItemRequestDTO request) {
        OrderItem item = getById(id);
        if (request.getOrderId() != null) item.setOrder(getOrderOrThrow(request.getOrderId()));
        if (request.getProductId() != null) item.setProduct(getProductOrThrow(request.getProductId()));
        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        return itemAdapter.update(item);
    }

    public void delete(UUID id) {
        itemAdapter.delete(id);
    }

    private Order getOrderOrThrow(UUID orderId) {
        return orderAdapter.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    private Product getProductOrThrow(UUID productId) {
        return productAdapter.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }
}
