package com.dariomatias.my_commerce.seed.subscription;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunSubscriptionSeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        SubscriptionSeed subscriptionSeed = context.getBean(SubscriptionSeed.class);
        subscriptionSeed.run();

        System.exit(0);
    }
}
