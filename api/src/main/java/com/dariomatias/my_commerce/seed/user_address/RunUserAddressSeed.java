package com.dariomatias.my_commerce.seed.user_address;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunUserAddressSeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        UserAddressSeed userAddressSeed = context.getBean(UserAddressSeed.class);
        userAddressSeed.createAddresses();

        System.exit(0);
    }
}
