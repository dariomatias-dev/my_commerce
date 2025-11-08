package com.dariomatias.my_commerce.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Bean
    public MinioClient minioClient() {
        Dotenv dotenv = Dotenv.load();

        String url = dotenv.get("MINIO_URL", "http://localhost:9000");
        String accessKey = dotenv.get("MINIO_ACCESS_KEY", "minioadmin");
        String secretKey = dotenv.get("MINIO_SECRET_KEY", "minioadmin");

        return MinioClient.builder()
                .endpoint(url)
                .credentials(accessKey, secretKey)
                .build();
    }
}
