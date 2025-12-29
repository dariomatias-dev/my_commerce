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

        for (int position = 0; position < images.length; position++) {
            MultipartFile imageFile = images[position];
            String objectName = folder + UUID.randomUUID() + ".jpeg";

            minioService.uploadFile(BUCKET_NAME, objectName, imageFile);

            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setUrl(objectName);
            image.setPosition(position);

            productImageRepository.save(image);

            savedImages.add(objectName);
        }

        return savedImages;
    }

    @Transactional
    public void syncImages(Product product, List<ProductImageOrderDTO> images) {

        List<ProductImage> existingImages =
                productImageRepository.findAllByProduct(product.getId());

        Map<UUID, ProductImage> existingMap = existingImages.stream()
                .collect(Collectors.toMap(ProductImage::getId, i -> i));

        Set<UUID> receivedIds = images.stream()
                .map(ProductImageOrderDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        for (ProductImage image : existingImages) {
            if (!receivedIds.contains(image.getId())) {
                productImageRepository.delete(image);
            }
        }

        for (int position = 0; position < images.size(); position++) {

            ProductImageOrderDTO dto = images.get(position);

            if (dto.getId() != null) {
                ProductImage image = existingMap.get(dto.getId());
                image.setPosition(position);
                productImageRepository.save(image);

            } else {
                ProductImage image = new ProductImage();
                image.setProduct(product);
                image.setUrl(dto.getUrl());
                image.setPosition(position);
                productImageRepository.save(image);
            }
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
