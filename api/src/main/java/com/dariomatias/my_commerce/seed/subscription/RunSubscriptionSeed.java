package com.dariomatias.my_commerce.seed.subscription;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunSubscriptionSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        SubscriptionSeed subscriptionSeed = context.getBean(SubscriptionSeed.class);
        subscriptionSeed.createSubscriptions();

        System.exit(0);
    }
}
