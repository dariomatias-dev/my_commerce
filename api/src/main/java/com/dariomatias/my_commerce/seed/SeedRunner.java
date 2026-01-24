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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class SeedRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedRunner.class);

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
        log.info("SEED_RUNNER | Iniciando reset do banco de dados");
        databaseReset.reset();
        log.info("SEED_RUNNER | Reset do banco finalizado");

        log.info("SEED_RUNNER | Iniciando AdminUserSeed");
        adminUserSeed.run();
        log.info("SEED_RUNNER | Finalizada AdminUserSeed");

        log.info("SEED_RUNNER | Iniciando UserSeed");
        userSeed.run();
        log.info("SEED_RUNNER | Finalizada UserSeed");

        log.info("SEED_RUNNER | Iniciando SubscriptionPlanSeed");
        subscriptionPlanSeed.run();
        log.info("SEED_RUNNER | Finalizada SubscriptionPlanSeed");

        log.info("SEED_RUNNER | Iniciando SubscriptionSeed");
        subscriptionSeed.run();
        log.info("SEED_RUNNER | Finalizada SubscriptionSeed");

        log.info("SEED_RUNNER | Iniciando StoreSeed");
        storeSeed.run();
        log.info("SEED_RUNNER | Finalizada StoreSeed");

        log.info("SEED_RUNNER | Iniciando CategorySeed");
        categorySeed.run();
        log.info("SEED_RUNNER | Finalizada CategorySeed");

        log.info("SEED_RUNNER | Iniciando ProductSeed");
        productSeed.run();
        log.info("SEED_RUNNER | Finalizada ProductSeed");

        log.info("SEED_RUNNER | Iniciando UserAddressSeed");
        userAddressSeed.run();
        log.info("SEED_RUNNER | Finalizada UserAddressSeed");

        log.info("SEED_RUNNER | Iniciando OrderSeed");
        orderSeed.run();
        log.info("SEED_RUNNER | Finalizada OrderSeed");

        log.info("SEED_RUNNER | Todas as seeds finalizadas");
    }
}
