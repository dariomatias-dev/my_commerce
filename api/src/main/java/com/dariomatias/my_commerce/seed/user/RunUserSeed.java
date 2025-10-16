package com.dariomatias.my_commerce.seed.user;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunUserSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        UserSeed userSeed = context.getBean(UserSeed.class);
        userSeed.createUsers();

        System.exit(0);
    }
}
