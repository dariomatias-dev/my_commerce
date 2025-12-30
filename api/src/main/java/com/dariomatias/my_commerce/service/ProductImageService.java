package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.product_image.ProductImageOrderDTO;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.ProductImage;
import com.dariomatias.my_commerce.repository.contract.ProductImageContract;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductImageService {

    private static final String BUCKET_NAME = "stores";

    private final MinioService minioService;
    private final ProductImageContract productImageRepository;

    public ProductImageService(
            MinioService minioService,
            ProductImageContract productImageRepository
    ) {
        this.minioService = minioService;
        this.productImageRepository = productImageRepository;
    }

    public List<String> upload(
            String storeSlug,
            Product product,
            MultipartFile[] images
    ) {
        if (images == null || images.length == 0) {
            return List.of();
        }

        String folder = buildFolder(storeSlug, product.getSlug());
        List<String> savedImages = new ArrayList<>();

        List<ProductImage> existingImages = productImageRepository.findAllByProduct(product.getId());
        int startPosition = existingImages.size();

        for (int i = 0; i < images.length; i++) {
            MultipartFile imageFile = images[i];
            String objectName = folder + UUID.randomUUID() + ".jpeg";

            minioService.uploadFile(BUCKET_NAME, objectName, imageFile);

            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setUrl(objectName);
            image.setPosition(startPosition + i);

            productImageRepository.save(image);

            savedImages.add(objectName);
        }

        return savedImages;
    }

    @Transactional
    public void removeImages(Product product, List<String> removedImageNames) {

        if (removedImageNames == null || removedImageNames.isEmpty()) {
            return;
        }

        List<ProductImage> existingImages =
                productImageRepository.findAllByProduct(product.getId());

        for (ProductImage image : existingImages) {
            if (removedImageNames.contains(image.getUrl())) {

                minioService.deleteFile(BUCKET_NAME, image.getUrl());

                productImageRepository.delete(image);
            }
        }

        List<ProductImage> remainingImages =
                productImageRepository.findAllByProduct(product.getId())
                        .stream()
                        .sorted(Comparator.comparingInt(ProductImage::getPosition))
                        .toList();

        for (int i = 0; i < remainingImages.size(); i++) {
            ProductImage image = remainingImages.get(i);
            image.setPosition(i);
            productImageRepository.save(image);
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

    public void deleteAll(String storeSlug, String productSlug) {
        String folder = buildFolder(storeSlug, productSlug);
        minioService.deleteFolder(BUCKET_NAME, folder);
    }

    private String buildFolder(String storeSlug, String productSlug) {
        return storeSlug + "/products/" + productSlug + "/";
    }
}
