package com.dariomatias.my_commerce.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MyCommerce API")
                        .description(
                                "REST API for the MyCommerce SaaS platform, designed to manage online stores."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Dário Matias")
                                .url("https://github.com/dariomatias-dev/my_commerce"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT"))
                );
    }
}
