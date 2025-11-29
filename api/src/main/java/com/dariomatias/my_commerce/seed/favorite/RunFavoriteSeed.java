package com.dariomatias.my_commerce.seed.favorite;

import com.dariomatias.my_commerce.MyCommerceApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ApplicationContext;

public class RunFavoriteSeed {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyCommerceApplication.class);
        app.setWebApplicationType(WebApplicationType.NONE);
        app.setAdditionalProfiles("seed");
        ApplicationContext context = app.run(args);

        FavoriteSeed favoriteSeed = context.getBean(FavoriteSeed.class);
        favoriteSeed.createFavorites();

        System.exit(0);
    }
}
