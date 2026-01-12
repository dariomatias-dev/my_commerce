package com.dariomatias.my_commerce.seed.product;

import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.CategoryRepository;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.contract.ProductImageContract;
import com.dariomatias.my_commerce.service.MinioService;
import com.dariomatias.my_commerce.util.RandomUtil;
import com.dariomatias.my_commerce.util.SlugUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class ProductSeed {

    private static final String BUCKET_NAME = "stores";

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageContract productImageRepository;
    private final MinioService minioService;

    public ProductSeed(
            ProductRepository productRepository,
            StoreRepository storeRepository,
            CategoryRepository categoryRepository,
            ProductImageContract productImageRepository,
            MinioService minioService
    ) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.minioService = minioService;
    }

    @Transactional
    public void createProducts() {
        List<Store> stores = storeRepository.findAll();
        if (stores.isEmpty()) return;

        int productIndex = 1;

        for (Store store : stores) {
            List<Category> categories = categoryRepository.findAllByStore(store);
            if (categories.isEmpty()) continue;

            boolean storeDeleted = store.getDeletedAt() != null;

            for (Category category : categories) {
                int productsPerCategory = 2 + (productIndex % 3);

                for (int i = 0; i < productsPerCategory; i++) {
                    String name = "Produto " + productIndex;
                    String slug = SlugUtil.generateSlug(name + "-" + productIndex);

                    boolean active;
                    LocalDateTime deletedAt = null;

                    if (storeDeleted) {
                        active = false;
                        deletedAt = LocalDateTime.now().minusDays(10);
                    } else {
                        RandomUtil.RandomResult result = RandomUtil.randomDeletion(10, 3);
                        active = !result.isDeleted();
                        deletedAt = result.getDeletedAt();
                    }

                    Product product = new Product();
                    product.setStore(store);
                    product.setCategory(category);
                    product.setName(name);
                    product.setSlug(slug);
                    product.setDescription("Produto da categoria " + category.getName());
                    product.setPrice(BigDecimal.valueOf(39.90 + productIndex));
                    product.setStock(5 + productIndex);
                    product.setActive(active);
                    product.setDeletedAt(deletedAt);

                    productRepository.save(product);
                    createProductImage(store.getSlug(), product, productIndex);

                    productIndex++;
                }
            }
        }
    }

    private void createProductImage(String storeSlug, Product product, int index) {
        String folder = storeSlug + "/products/" + product.getSlug() + "/";
        String objectName = folder + UUID.randomUUID() + ".png";
        byte[] imageBytes = generateProductImage("P" + index);

        minioService.uploadImage(BUCKET_NAME, objectName, imageBytes);

        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setUrl(objectName);
        image.setPosition(0);

        productImageRepository.save(image);
    }

    private byte[] generateProductImage(String text) {
        BufferedImage image = new BufferedImage(600, 600, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        g.setColor(Color.decode(randomColor()));
        g.fillRect(0, 0, 600, 600);

        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 96));

        FontMetrics fm = g.getFontMetrics();
        int x = (600 - fm.stringWidth(text)) / 2;
        int y = (600 - fm.getHeight()) / 2 + fm.getAscent();

        g.drawString(text, x, y);
        g.dispose();

        return toBytes(image);
    }

    private byte[] toBytes(BufferedImage image) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, "png", out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String randomColor() {
        return String.format("#%06X", (int) (Math.random() * 0xFFFFFF));
    }
}
