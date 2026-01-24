package com.dariomatias.my_commerce.seed;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class DatabaseReset {

    private final JdbcTemplate jdbcTemplate;

    public void reset() {
        jdbcTemplate.execute("""
            TRUNCATE TABLE
                order_items,
                orders,
                order_addresses,
                product_images,
                products,
                categories,
                stores,
                subscriptions,
                subscription_plans,
                user_addresses,
                users
            RESTART IDENTITY CASCADE
        """);
    }
}
