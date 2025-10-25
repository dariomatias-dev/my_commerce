package com.dariomatias.my_commerce.seed.favorite;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

public class RunFavoriteSeed {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(MyCommerceApplication.class);

        FavoriteSeed favoriteSeed = context.getBean(FavoriteSeed.class);
        favoriteSeed.createFavorites();

        System.exit(0);
    }
}
