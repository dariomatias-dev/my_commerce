package com.dariomatias.my_commerce.seed.order_item;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunOrderItemSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        OrderItemSeed orderItemSeed = context.getBean(OrderItemSeed.class);
        orderItemSeed.createOrderItems();

        System.exit(0);
    }
}
