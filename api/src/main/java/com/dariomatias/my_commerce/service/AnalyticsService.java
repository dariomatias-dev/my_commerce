package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.analytics.TotalRevenueResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.UniqueCustomersResponseDTO;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AnalyticsService {

    private final OrderContract orderRepository;

    public AnalyticsService(
            OrderContract orderRepository
    ) {
        this.orderRepository = orderRepository;
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

    public UniqueCustomersResponseDTO getUniqueCustomersByStore(UUID storeId) {
        long total = orderRepository
                .countDistinctCustomersByStoreIdAndStatus(
                        storeId,
                        Status.COMPLETED
                );

        return new UniqueCustomersResponseDTO(total);
    }

    public TotalRevenueResponseDTO getTotalRevenueByStore(UUID storeId) {
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
}
