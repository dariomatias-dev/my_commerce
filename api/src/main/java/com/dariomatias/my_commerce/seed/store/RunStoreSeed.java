package com.dariomatias.my_commerce.seed.store;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunStoreSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        StoreSeed storeSeed = context.getBean(StoreSeed.class);
        storeSeed.createStores();

        System.exit(0);
    }
}
