package com.dariomatias.my_commerce.seed.product;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunProductSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        ProductSeed productSeed = context.getBean(ProductSeed.class);
        productSeed.createProducts();

        System.exit(0);
    }
}
