package com.dariomatias.my_commerce.seed.transaction;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunTransactionSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class, args);

        TransactionSeed transactionSeed = context.getBean(TransactionSeed.class);
        transactionSeed.createTransactions();

        System.exit(0);
    }
}
