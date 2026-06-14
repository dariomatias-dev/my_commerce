package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.ProductImage;
import com.dariomatias.my_commerce.repository.contract.ProductImageContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductImageService")
class ProductImageServiceTest {

    @Mock
    private MinioService minioService;

    @Mock
    private ProductImageContract productImageRepository;

    @InjectMocks
    private ProductImageService productImageService;

    private static final String BUCKET = "stores";
    private static final String STORE_SLUG = "my-store";
    private static final String PRODUCT_SLUG = "my-product";

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(UUID.randomUUID());
        product.setSlug(PRODUCT_SLUG);
        product.setImages(new ArrayList<>());
    }

    @Nested
    @DisplayName("upload")
    class Upload {

        @Test
        @DisplayName("null images should return empty list without calling MinIO")
        void nullImages_shouldReturnEmpty() {
            List<String> result = productImageService.upload(STORE_SLUG, product, null);

            assertTrue(result.isEmpty());
            verifyNoInteractions(minioService, productImageRepository);
        }

        @Test
        @DisplayName("empty image array should return empty list")
        void emptyImageArray_shouldReturnEmpty() {
            List<String> result = productImageService.upload(STORE_SLUG, product, new MultipartFile[0]);

            assertTrue(result.isEmpty());
            verifyNoInteractions(minioService, productImageRepository);
        }

        @Test
        @DisplayName("valid images should be uploaded to MinIO and saved in repository")
        void validImages_shouldUploadAndSave() {
            MultipartFile img1 = mock(MultipartFile.class);
            MultipartFile img2 = mock(MultipartFile.class);

            when(productImageRepository.findAllByProduct(product.getId())).thenReturn(List.of());
            when(productImageRepository.save(any(ProductImage.class))).thenAnswer(inv -> inv.getArgument(0));

            List<String> result = productImageService.upload(STORE_SLUG, product, new MultipartFile[]{img1, img2});

            assertEquals(2, result.size());
            verify(minioService, times(2)).uploadFile(eq(BUCKET), anyString(), any(MultipartFile.class));
            verify(productImageRepository, times(2)).save(any(ProductImage.class));
        }

        @Test
        @DisplayName("positions should continue after existing images")
        void positions_shouldContinueAfterExisting() {
            ProductImage existing = new ProductImage();
            existing.setPosition(0);

            when(productImageRepository.findAllByProduct(product.getId()))
                    .thenReturn(List.of(existing));

            ArgumentCaptor<ProductImage> captor = ArgumentCaptor.forClass(ProductImage.class);
            when(productImageRepository.save(captor.capture())).thenAnswer(inv -> inv.getArgument(0));

            MultipartFile img = mock(MultipartFile.class);
            productImageService.upload(STORE_SLUG, product, new MultipartFile[]{img});

            assertEquals(1, captor.getValue().getPosition());
        }

        @Test
        @DisplayName("object name should contain storeSlug and productSlug in path")
        void objectName_shouldContainSlugsInPath() {
            when(productImageRepository.findAllByProduct(product.getId())).thenReturn(List.of());
            when(productImageRepository.save(any(ProductImage.class))).thenAnswer(inv -> inv.getArgument(0));

            MultipartFile img = mock(MultipartFile.class);
            productImageService.upload(STORE_SLUG, product, new MultipartFile[]{img});

            ArgumentCaptor<String> objectNameCaptor = ArgumentCaptor.forClass(String.class);
            verify(minioService).uploadFile(eq(BUCKET), objectNameCaptor.capture(), any());
            assertTrue(objectNameCaptor.getValue().startsWith(STORE_SLUG + "/products/" + PRODUCT_SLUG + "/"));
        }
    }

    @Nested
    @DisplayName("removeImages")
    class RemoveImages {

        @Test
        @DisplayName("null list should do nothing")
        void nullList_shouldDoNothing() {
            productImageService.removeImages(product, null);

            verifyNoInteractions(minioService);
        }

        @Test
        @DisplayName("empty list should do nothing")
        void emptyList_shouldDoNothing() {
            productImageService.removeImages(product, List.of());

            verifyNoInteractions(minioService);
        }

        @Test
        @DisplayName("matching URL should be deleted from MinIO and removed from product")
        void matchingUrl_shouldDeleteAndRemove() {
            String imageUrl = STORE_SLUG + "/products/" + PRODUCT_SLUG + "/abc.jpeg";

            ProductImage image = new ProductImage();
            image.setUrl(imageUrl);
            image.setPosition(0);
            product.setImages(new ArrayList<>(List.of(image)));

            productImageService.removeImages(product, List.of(imageUrl));

            verify(minioService).deleteFile(BUCKET, imageUrl);
            assertTrue(product.getImages().isEmpty());
        }

        @Test
        @DisplayName("non-matching URL should not delete from MinIO")
        void nonMatchingUrl_shouldNotDelete() {
            ProductImage image = new ProductImage();
            image.setUrl("stores/store/prod/real.jpeg");
            image.setPosition(0);
            product.setImages(new ArrayList<>(List.of(image)));

            productImageService.removeImages(product, List.of("stores/store/prod/other.jpeg"));

            verifyNoInteractions(minioService);
            assertEquals(1, product.getImages().size());
        }

        @Test
        @DisplayName("after removal positions of remaining images should be reordered from zero")
        void afterRemoval_shouldReorderPositions() {
            String url1 = STORE_SLUG + "/products/" + PRODUCT_SLUG + "/img1.jpeg";
            String url2 = STORE_SLUG + "/products/" + PRODUCT_SLUG + "/img2.jpeg";
            String url3 = STORE_SLUG + "/products/" + PRODUCT_SLUG + "/img3.jpeg";

            ProductImage img1 = new ProductImage();
            img1.setUrl(url1);
            img1.setPosition(0);

            ProductImage img2 = new ProductImage();
            img2.setUrl(url2);
            img2.setPosition(1);

            ProductImage img3 = new ProductImage();
            img3.setUrl(url3);
            img3.setPosition(2);

            product.setImages(new ArrayList<>(List.of(img1, img2, img3)));

            productImageService.removeImages(product, List.of(url1));

            List<ProductImage> remaining = product.getImages();
            assertEquals(2, remaining.size());
            assertEquals(0, remaining.get(0).getPosition());
            assertEquals(1, remaining.get(1).getPosition());
        }
    }

    @Nested
    @DisplayName("rename")
    class Rename {

        @Test
        @DisplayName("should copy each object to new path then delete from old path")
        void shouldCopyAndDeleteObjects() {
            String oldSlug = "old-product";
            String newSlug = "new-product";
            String oldFolder = STORE_SLUG + "/products/" + oldSlug + "/";
            String newFolder = STORE_SLUG + "/products/" + newSlug + "/";
            String objectName = oldFolder + "img.jpeg";

            when(minioService.listObjects(BUCKET, oldFolder)).thenReturn(List.of(objectName));

            productImageService.rename(STORE_SLUG, oldSlug, newSlug);

            verify(minioService).copyFile(BUCKET, objectName, newFolder + "img.jpeg");
            verify(minioService).deleteFile(BUCKET, objectName);
        }

        @Test
        @DisplayName("empty folder should not call copyFile or deleteFile")
        void emptyFolder_shouldNotCopyOrDelete() {
            when(minioService.listObjects(BUCKET, STORE_SLUG + "/products/old/"))
                    .thenReturn(List.of());

            productImageService.rename(STORE_SLUG, "old", "new");

            verify(minioService, never()).copyFile(any(), any(), any());
            verify(minioService, never()).deleteFile(any(), any());
        }
    }
}
