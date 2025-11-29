package com.dariomatias.my_commerce.seed.admin_user;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunAdminUserSeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        AdminUserSeed adminUserSeed = context.getBean(AdminUserSeed.class);
        adminUserSeed.createAdminUser();

        System.exit(0);
    }
}
