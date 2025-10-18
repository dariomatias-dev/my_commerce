package com.dariomatias.my_commerce.seed.subscription_plan;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunSubscriptionPlanSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        SubscriptionPlanSeed subscriptionPlanSeed = context.getBean(SubscriptionPlanSeed.class);
        subscriptionPlanSeed.createPlans();

        System.exit(0);
    }
}
