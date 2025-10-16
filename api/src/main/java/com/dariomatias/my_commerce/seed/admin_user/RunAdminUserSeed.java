package com.dariomatias.my_commerce.seed.admin_user;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunAdminUserSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        AdminUserSeed adminUserSeed = context.getBean(AdminUserSeed.class);
        adminUserSeed.createAdminUser();

        System.exit(0);
    }
}
