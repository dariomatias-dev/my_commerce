package com.dariomatias.my_commerce.service;

import io.minio.*;
import io.minio.messages.Item;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("MinioService")
class MinioServiceTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private MinioService minioService;

    private static final String BUCKET = "stores";
    private static final String OBJECT = "store/products/product/img.jpeg";

    @Nested
    @DisplayName("uploadFile")
    class UploadFile {

        private MultipartFile file;

        @BeforeEach
        void setUp() {
            file = mock(MultipartFile.class);
        }

        @Test
        @DisplayName("file larger than 5MB should throw 400")
        void fileLargerThan5MB_shouldThrow400() {
            when(file.getSize()).thenReturn(6L * 1024 * 1024);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.uploadFile(BUCKET, OBJECT, file));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verifyNoInteractions(minioClient);
        }

        @Test
        @DisplayName("invalid content type should throw 400")
        void invalidContentType_shouldThrow400() {
            when(file.getSize()).thenReturn(1024L);
            when(file.getContentType()).thenReturn("application/pdf");

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.uploadFile(BUCKET, OBJECT, file));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verifyNoInteractions(minioClient);
        }

        @Test
        @DisplayName("null content type should throw 400")
        void nullContentType_shouldThrow400() {
            when(file.getSize()).thenReturn(1024L);
            when(file.getContentType()).thenReturn(null);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.uploadFile(BUCKET, OBJECT, file));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid JPEG file should call putObject")
        void validJpegFile_shouldCallPutObject() throws Exception {
            when(file.getSize()).thenReturn(1024L);
            when(file.getContentType()).thenReturn("image/jpeg");
            when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
            when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

            minioService.uploadFile(BUCKET, OBJECT, file);

            verify(minioClient).putObject(any(PutObjectArgs.class));
        }

        @Test
        @DisplayName("valid PNG file should call putObject")
        void validPngFile_shouldCallPutObject() throws Exception {
            when(file.getSize()).thenReturn(512L);
            when(file.getContentType()).thenReturn("image/png");
            when(file.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
            when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

            minioService.uploadFile(BUCKET, OBJECT, file);

            verify(minioClient).putObject(any(PutObjectArgs.class));
        }
    }

    @Nested
    @DisplayName("deleteFile")
    class DeleteFile {

        @Test
        @DisplayName("success should call removeObject")
        void success_shouldCallRemoveObject() throws Exception {
            minioService.deleteFile(BUCKET, OBJECT);

            verify(minioClient).removeObject(any(RemoveObjectArgs.class));
        }

        @Test
        @DisplayName("MinIO error should throw 500")
        void minioError_shouldThrow500() throws Exception {
            doThrow(new RuntimeException("MinIO offline"))
                    .when(minioClient).removeObject(any(RemoveObjectArgs.class));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.deleteFile(BUCKET, OBJECT));

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("listObjects")
    class ListObjects {

        @Test
        @DisplayName("should return list of object names")
        void shouldReturnObjectNames() throws Exception {
            Item item1 = mock(Item.class);
            when(item1.objectName()).thenReturn("store/products/prod/a.jpeg");

            Item item2 = mock(Item.class);
            when(item2.objectName()).thenReturn("store/products/prod/b.jpeg");

            @SuppressWarnings("unchecked")
            Result<Item> result1 = mock(Result.class);
            when(result1.get()).thenReturn(item1);

            @SuppressWarnings("unchecked")
            Result<Item> result2 = mock(Result.class);
            when(result2.get()).thenReturn(item2);

            when(minioClient.listObjects(any(ListObjectsArgs.class)))
                    .thenReturn(List.of(result1, result2));

            List<String> objects = minioService.listObjects(BUCKET, "store/products/prod/");

            assertEquals(2, objects.size());
            assertTrue(objects.contains("store/products/prod/a.jpeg"));
            assertTrue(objects.contains("store/products/prod/b.jpeg"));
        }

        @Test
        @DisplayName("empty folder should return empty list")
        void emptyFolder_shouldReturnEmptyList() {
            when(minioClient.listObjects(any(ListObjectsArgs.class)))
                    .thenReturn(List.of());

            List<String> objects = minioService.listObjects(BUCKET, "empty-folder/");

            assertTrue(objects.isEmpty());
        }
    }

    @Nested
    @DisplayName("copyFile")
    class CopyFile {

        @Test
        @DisplayName("success should call copyObject")
        void success_shouldCallCopyObject() throws Exception {
            minioService.copyFile(BUCKET, "source/obj.jpeg", "target/obj.jpeg");

            verify(minioClient).copyObject(any(CopyObjectArgs.class));
        }

        @Test
        @DisplayName("MinIO error should throw 500")
        void minioError_shouldThrow500() throws Exception {
            doThrow(new RuntimeException("copy failed"))
                    .when(minioClient).copyObject(any(CopyObjectArgs.class));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.copyFile(BUCKET, "source/obj.jpeg", "target/obj.jpeg"));

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("createBucket")
    class CreateBucket {

        @Test
        @DisplayName("existing bucket should not call makeBucket")
        void existingBucket_shouldNotCreate() throws Exception {
            when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

            minioService.createBucket(BUCKET);

            verify(minioClient, never()).makeBucket(any(MakeBucketArgs.class));
        }

        @Test
        @DisplayName("non-existing bucket should create it and set public policy")
        void nonExistingBucket_shouldCreateWithPolicy() throws Exception {
            when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(false);

            minioService.createBucket(BUCKET);

            verify(minioClient).makeBucket(any(MakeBucketArgs.class));
            verify(minioClient).setBucketPolicy(any(SetBucketPolicyArgs.class));
        }

        @Test
        @DisplayName("MinIO error should throw 500")
        void minioError_shouldThrow500() throws Exception {
            doThrow(new RuntimeException("connection refused"))
                    .when(minioClient).bucketExists(any(BucketExistsArgs.class));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.createBucket(BUCKET));

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("deleteFolder")
    class DeleteFolder {

        @Test
        @DisplayName("should remove each object listed in the folder")
        void shouldRemoveAllObjects() throws Exception {
            Item item = mock(Item.class);
            when(item.objectName()).thenReturn("store/products/prod/img.jpeg");

            @SuppressWarnings("unchecked")
            Result<Item> result = mock(Result.class);
            when(result.get()).thenReturn(item);

            when(minioClient.listObjects(any(ListObjectsArgs.class)))
                    .thenReturn(List.of(result));

            minioService.deleteFolder(BUCKET, "store/products/prod/");

            verify(minioClient).removeObject(any(RemoveObjectArgs.class));
        }

        @Test
        @DisplayName("empty folder should not call removeObject")
        void emptyFolder_shouldNotRemove() throws Exception {
            when(minioClient.listObjects(any(ListObjectsArgs.class)))
                    .thenReturn(List.of());

            minioService.deleteFolder(BUCKET, "empty-folder/");

            verify(minioClient, never()).removeObject(any(RemoveObjectArgs.class));
        }
    }

    @Nested
    @DisplayName("uploadImage")
    class UploadImage {

        @Test
        @DisplayName("should create bucket and call putObject with provided bytes")
        void shouldUploadImageBytes() throws Exception {
            when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

            minioService.uploadImage(BUCKET, "store/logo.png", new byte[]{1, 2, 3});

            verify(minioClient).putObject(any(PutObjectArgs.class));
        }

        @Test
        @DisplayName("MinIO error should throw 500")
        void minioError_shouldThrow500() throws Exception {
            when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);
            doThrow(new RuntimeException("put failed"))
                    .when(minioClient).putObject(any(PutObjectArgs.class));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> minioService.uploadImage(BUCKET, "store/logo.png", new byte[]{1}));

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, ex.getStatusCode());
        }
    }
}
