package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.analytics.ConversionRateResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.UniqueCustomersResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.VisitorsPerHourResponseDTO;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import com.dariomatias.my_commerce.repository.contract.TransactionContract;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AnalyticsService {

    private final StringRedisTemplate redisTemplate;
    private final OrderContract orderRepository;

    private static final DateTimeFormatter HOUR_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHH");

    public AnalyticsService(
            StringRedisTemplate redisTemplate,
            OrderContract orderRepository
    ) {
        this.redisTemplate = redisTemplate;
        this.orderRepository = orderRepository;
    }

    public List<VisitorsPerHourResponseDTO> getVisitorsPerHour(UUID storeId) {
        List<VisitorsPerHourResponseDTO> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 23; i >= 0; i--) {
            LocalDateTime hour = now.minusHours(i);
            String key = buildVisitorsKey(storeId, hour);

            String value = redisTemplate.opsForValue().get(key);
            long count = value != null ? Long.parseLong(value) : 0;

            result.add(
                    new VisitorsPerHourResponseDTO(
                            hour.getHour() + ":00",
                            count
                    )
            );
        }

        return result;
    }

    public ConversionRateResponseDTO getConversionRate(UUID storeId) {
        long visitors = getTotalVisitorsLast24h(storeId);
        long conversions = orderRepository
                .countByStoreIdAndStatus(storeId, Status.COMPLETED);

        double conversionRate = visitors > 0
                ? (double) conversions / visitors * 100
                : 0;

        return new ConversionRateResponseDTO(
                visitors,
                conversions,
                Math.round(conversionRate * 100.0) / 100.0
        );
    }

    public UniqueCustomersResponseDTO getUniqueCustomers(UUID userId) {
        long total = orderRepository
                .countDistinctCustomersByUserIdAndStatus(
                        userId,
                        Status.COMPLETED
                );

        return new UniqueCustomersResponseDTO(total);
    }

    private long getTotalVisitorsLast24h(UUID storeId) {
        long total = 0;
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < 24; i++) {
            String key = buildVisitorsKey(storeId, now.minusHours(i));
            String value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                total += Long.parseLong(value);
            }
        }

        return total;
    }

    private String buildVisitorsKey(UUID storeId, LocalDateTime dateTime) {
        return "store:%s:visits:%s".formatted(
                storeId,
                dateTime.format(HOUR_FORMAT)
        );
    }
}
