package com.dariomatias.my_commerce.controller;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final MinioClient minioClient;

    public FileController(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @GetMapping("/{bucket}/**")
    public void getFile(
            @PathVariable String bucket,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {
            String requestUri = request.getRequestURI();

            String prefix = "/api/files/" + bucket + "/";
            String objectName = requestUri.substring(prefix.length());

            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build()
            );

            response.setContentType(stat.contentType());
            response.setContentLengthLong(stat.size());
            response.setHeader("Cache-Control", "public, max-age=31536000");

            try (InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build()
            )) {
                stream.transferTo(response.getOutputStream());
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
