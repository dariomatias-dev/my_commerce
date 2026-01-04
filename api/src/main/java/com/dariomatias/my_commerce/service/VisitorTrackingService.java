package com.dariomatias.my_commerce.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class VisitorTrackingService {

    private static final DateTimeFormatter FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHH");

    private final StringRedisTemplate redisTemplate;

    public VisitorTrackingService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void registerVisit(UUID storeId) {
        String key = "store:%s:visits:%s".formatted(
                storeId,
                LocalDateTime.now().format(FORMAT)
        );

        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, java.time.Duration.ofDays(2));
    }
}
