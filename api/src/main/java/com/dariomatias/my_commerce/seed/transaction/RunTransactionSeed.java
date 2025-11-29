package com.dariomatias.my_commerce.seed.transaction;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunTransactionSeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        TransactionSeed transactionSeed = context.getBean(TransactionSeed.class);
        transactionSeed.createTransactions();

        System.exit(0);
    }
}
