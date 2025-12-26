package com.dariomatias.my_commerce.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class ProductImageService {

    private static final String BUCKET_NAME = "stores";
    private final MinioService minioService;

    public ProductImageService(MinioService minioService) {
        this.minioService = minioService;
    }

    public void upload(String storeSlug, String productSlug, MultipartFile[] images) {
        if (images == null || images.length == 0) {
            return;
        }

        String folder = buildFolder(storeSlug, productSlug);

        for (MultipartFile image : images) {
            String objectName = folder + UUID.randomUUID() + ".jpeg";
            minioService.uploadFile(BUCKET_NAME, objectName, image);
        }
    }

    public void rename(String storeSlug, String oldProductSlug, String newProductSlug) {
        String oldFolder = buildFolder(storeSlug, oldProductSlug);
        String newFolder = buildFolder(storeSlug, newProductSlug);

        List<String> objects = minioService.listObjects(BUCKET_NAME, oldFolder);

        for (String objectName : objects) {
            String newObjectName = objectName.replace(oldFolder, newFolder);
            minioService.copyFile(BUCKET_NAME, objectName, newObjectName);
            minioService.deleteFile(BUCKET_NAME, objectName);
        }
    }

    public void delete(String storeSlug, String productSlug, List<String> imageNames) {
        if (imageNames == null || imageNames.isEmpty()) {
            return;
        }

        String folder = buildFolder(storeSlug, productSlug);

        for (String objectName : imageNames) {
            minioService.deleteFile(BUCKET_NAME, folder + objectName);
        }
    }

    public void deleteAll(String storeSlug, String productSlug) {
        String folder = buildFolder(storeSlug, productSlug);
        minioService.deleteFolder(BUCKET_NAME, folder);
    }

    private String buildFolder(String storeSlug, String productSlug) {
        return storeSlug + "/products/" + productSlug + "/";
    }
}
