package com.dariomatias.my_commerce.seed.category;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunCategorySeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        CategorySeed categorySeed = context.getBean(CategorySeed.class);
        categorySeed.createCategories();

        System.exit(0);
    }
}
