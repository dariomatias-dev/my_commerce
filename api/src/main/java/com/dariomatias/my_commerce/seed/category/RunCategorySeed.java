package com.dariomatias.my_commerce.seed.category;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunCategorySeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        CategorySeed categorySeed = context.getBean(CategorySeed.class);
        categorySeed.createCategories();

        System.exit(0);
    }
}
