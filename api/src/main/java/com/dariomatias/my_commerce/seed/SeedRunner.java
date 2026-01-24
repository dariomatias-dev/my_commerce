package com.dariomatias.my_commerce.seed;

import com.dariomatias.my_commerce.seed.admin_user.AdminUserSeed;
import com.dariomatias.my_commerce.seed.category.CategorySeed;
import com.dariomatias.my_commerce.seed.order.OrderSeed;
import com.dariomatias.my_commerce.seed.product.ProductSeed;
import com.dariomatias.my_commerce.seed.store.StoreSeed;
import com.dariomatias.my_commerce.seed.subscription.SubscriptionSeed;
import com.dariomatias.my_commerce.seed.subscription_plan.SubscriptionPlanSeed;
import com.dariomatias.my_commerce.seed.user.UserSeed;
import com.dariomatias.my_commerce.seed.user_address.UserAddressSeed;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class SeedRunner implements CommandLineRunner {

    private final DatabaseReset databaseReset;

    private final AdminUserSeed adminUserSeed;
    private final UserSeed userSeed;
    private final SubscriptionPlanSeed subscriptionPlanSeed;
    private final SubscriptionSeed subscriptionSeed;
    private final StoreSeed storeSeed;
    private final CategorySeed categorySeed;
    private final ProductSeed productSeed;
    private final UserAddressSeed userAddressSeed;
    private final OrderSeed orderSeed;

    @Override
    public void run(String... args) {
        databaseReset.reset();

        adminUserSeed.run();
        userSeed.run();
        subscriptionPlanSeed.run();
        subscriptionSeed.run();
        storeSeed.run();
        categorySeed.run();
        productSeed.run();
        userAddressSeed.run();
        orderSeed.run();
    }
}
