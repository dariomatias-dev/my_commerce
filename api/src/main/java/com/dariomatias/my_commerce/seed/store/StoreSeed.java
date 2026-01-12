package com.dariomatias.my_commerce.seed.store;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.service.MinioService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class StoreSeed {

    private static final String BUCKET_NAME = "stores";

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;

    public StoreSeed(
            StoreRepository storeRepository,
            UserRepository userRepository,
            MinioService minioService
    ) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.minioService = minioService;
    }

    @Transactional
    public void createStores() {
        List<User> subscribers = userRepository.findByRole(UserRole.SUBSCRIBER);

        if (subscribers.isEmpty()) return;

        int storeIndex = 1;

        for (int u = 0; u < subscribers.size(); u++) {
            User user = subscribers.get(u);

            if (!user.isEnabled() && user.getDeletedAt() == null) {
                continue;
            }

            int storesPerUser = (u % 20) + 1;

            for (int i = 0; i < storesPerUser; i++) {
                String slug = "loja-" + storeIndex;

                if (storeRepository.existsBySlugAndDeletedAtIsNull(slug)) {
                    storeIndex++;
                    continue;
                }

                String basePath = slug + "/";

                minioService.uploadImage(
                        BUCKET_NAME,
                        basePath + "logo.png",
                        generateLogoImage("L" + storeIndex)
                );

                minioService.uploadImage(
                        BUCKET_NAME,
                        basePath + "banner.png",
                        generateBannerImage("Loja " + storeIndex)
                );

                Store store = new Store();
                store.setName("Loja " + storeIndex);
                store.setSlug(slug);
                store.setDescription("Descrição da Loja " + storeIndex);
                store.setThemeColor(randomColor());
                store.setUser(user);

                if (user.isDeleted()) {
                    store.setIsActive(false);
                    store.setDeletedAt(LocalDateTime.now().minusDays(10));
                } else if (user.isEnabled()) {
                    if (storeIndex % 10 == 0) {
                        store.setIsActive(false);
                        store.setDeletedAt(LocalDateTime.now().minusDays(1));
                    } else {
                        store.setIsActive(true);
                    }
                }

                storeRepository.save(store);
                storeIndex++;
            }
        }
    }

    private byte[] generateLogoImage(String text) {
        BufferedImage image = new BufferedImage(256, 256, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        g.setColor(Color.decode(randomColor()));
        g.fillRect(0, 0, 256, 256);

        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 96));

        FontMetrics fm = g.getFontMetrics();
        int x = (256 - fm.stringWidth(text)) / 2;
        int y = (256 - fm.getHeight()) / 2 + fm.getAscent();

        g.drawString(text, x, y);
        g.dispose();

        return toBytes(image);
    }

    private byte[] generateBannerImage(String text) {
        BufferedImage image = new BufferedImage(1200, 300, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        g.setColor(Color.decode(randomColor()));
        g.fillRect(0, 0, 1200, 300);

        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 64));

        FontMetrics fm = g.getFontMetrics();
        int x = (1200 - fm.stringWidth(text)) / 2;
        int y = (300 - fm.getHeight()) / 2 + fm.getAscent();

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
