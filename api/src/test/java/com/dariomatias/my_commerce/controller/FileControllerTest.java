package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ControllerTest(FileController.class)
class FileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MinioClient minioClient;

    @Nested
    @DisplayName("GET /api/files/{bucket}/**")
    class GetFile {

        @Test
        @DisplayName("should return 404 when bucket is invalid")
        void shouldReturn404WithInvalidBucket() throws Exception {
            mockMvc.perform(get("/api/files/invalid-bucket/image.jpg"))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should return 404 when file is not found in MinIO")
        void shouldReturn404WithMinIOError() throws Exception {
            when(minioClient.statObject(any(StatObjectArgs.class)))
                    .thenThrow(new RuntimeException("MinIO error"));

            mockMvc.perform(get("/api/files/stores/image.jpg"))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should return 400 when path contains traversal (..)")
        void shouldReturn400WithPathTraversal() throws Exception {
            mockMvc.perform(get("/api/files/stores/image..jpg"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("should return 200 when bucket and file are valid")
        void shouldReturn200WithValidBucketAndExistingFile() throws Exception {
            StatObjectResponse statResponse = mock(StatObjectResponse.class);
            when(statResponse.contentType()).thenReturn("image/jpeg");
            when(statResponse.size()).thenReturn(100L);
            when(minioClient.statObject(any(StatObjectArgs.class))).thenReturn(statResponse);

            GetObjectResponse getObjectResponse = mock(GetObjectResponse.class);
            when(getObjectResponse.read(any(byte[].class), any(int.class), any(int.class))).thenReturn(-1);
            when(minioClient.getObject(any(GetObjectArgs.class))).thenReturn(getObjectResponse);

            mockMvc.perform(get("/api/files/stores/image.jpg"))
                    .andExpect(status().isOk());
        }
    }
}
