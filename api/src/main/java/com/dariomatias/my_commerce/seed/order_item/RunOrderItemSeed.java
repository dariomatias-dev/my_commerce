package com.dariomatias.my_commerce.seed.order_item;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunOrderItemSeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        OrderItemSeed orderItemSeed = context.getBean(OrderItemSeed.class);
        orderItemSeed.createOrderItems();

        System.exit(0);
    }
}
