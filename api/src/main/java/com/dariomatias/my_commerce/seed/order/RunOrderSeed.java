package com.dariomatias.my_commerce.seed.order;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunOrderSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        OrderSeed orderSeed = context.getBean(OrderSeed.class);
        orderSeed.createOrders();

        System.exit(0);
    }
}
