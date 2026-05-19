package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.analytics.TotalRevenueResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.UniqueCustomersResponseDTO;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AnalyticsService {

    private final OrderContract orderRepository;
    private final StoreContract storeRepository;

    public AnalyticsService(
            OrderContract orderRepository,
            StoreContract storeRepository
    ) {
        this.orderRepository = orderRepository;
        this.storeRepository = storeRepository;
    }

    public UniqueCustomersResponseDTO getUniqueCustomers(UUID userId) {
        long total = orderRepository
                .countDistinctCustomersByUserIdAndStatus(
                        userId,
                        Status.COMPLETED
                );

        return new UniqueCustomersResponseDTO(total);
    }

    public TotalRevenueResponseDTO getTotalRevenue(UUID userId) {
        BigDecimal total = orderRepository
                .sumTotalRevenueByUserIdAndStatus(userId, Status.COMPLETED);

        return new TotalRevenueResponseDTO(
                total != null ? total : BigDecimal.ZERO
        );
    }

    public UniqueCustomersResponseDTO getUniqueCustomersByStore(UUID storeId, User user) {
        verifyStoreAccess(storeId, user);

        long total = orderRepository
                .countDistinctCustomersByStoreIdAndStatus(
                        storeId,
                        Status.COMPLETED
                );

        return new UniqueCustomersResponseDTO(total);
    }

    public TotalRevenueResponseDTO getTotalRevenueByStore(UUID storeId, User user) {
        verifyStoreAccess(storeId, user);

        BigDecimal total = orderRepository
                .sumTotalRevenueByStoreIdAndStatus(
                        storeId,
                        Status.COMPLETED
                );

        return new TotalRevenueResponseDTO(
                total != null ? total : BigDecimal.ZERO
        );
    }

    public BigDecimal getTotalRevenue() {
        BigDecimal total = orderRepository.sumTotalRevenueByStatus(Status.COMPLETED);

        return total != null ? total : BigDecimal.ZERO;
    }

    private void verifyStoreAccess(UUID storeId, User user) {
        if (UserRole.ADMIN.equals(user.getRole())) {
            return;
        }
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
        if (!store.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
    }
}
