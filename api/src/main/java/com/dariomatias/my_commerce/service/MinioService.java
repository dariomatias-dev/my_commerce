package com.dariomatias.my_commerce.service;

import io.minio.*;
import io.minio.messages.Item;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class MinioService {

    private final MinioClient minioClient;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void createBucket(String bucketName) {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                String policyJson = "{\n" +
                        "  \"Version\":\"2012-10-17\",\n" +
                        "  \"Statement\":[{\n" +
                        "    \"Effect\":\"Allow\",\n" +
                        "    \"Principal\":{\"AWS\":\"*\"},\n" +
                        "    \"Action\":[\"s3:GetObject\"],\n" +
                        "    \"Resource\":[\"arn:aws:s3:::" + bucketName + "/*\"]\n" +
                        "  }]\n" +
                        "}";
                minioClient.setBucketPolicy(
                        SetBucketPolicyArgs.builder()
                                .bucket(bucketName)
                                .config(policyJson)
                                .build()
                );
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar bucket: " + bucketName, e);
        }
    }

    public void deleteBucket(String bucketName) {
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(
                    ListObjectsArgs.builder().bucket(bucketName).recursive(true).build()
            );
            for (Result<Item> result : results) {
                minioClient.removeObject(
                        RemoveObjectArgs.builder().bucket(bucketName).object(result.get().objectName()).build()
                );
            }
            minioClient.removeBucket(RemoveBucketArgs.builder().bucket(bucketName).build());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao excluir bucket: " + bucketName, e);
        }
    }

    public void deleteFolder(String bucketName, String folder) {
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(
                    ListObjectsArgs.builder().bucket(bucketName).prefix(folder).recursive(true).build()
            );
            for (Result<Item> result : results) {
                minioClient.removeObject(
                        RemoveObjectArgs.builder().bucket(bucketName).object(result.get().objectName()).build()
                );
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao excluir pasta: " + folder, e);
        }
    }

    public void uploadFile(String bucketName, String objectName, MultipartFile file) {
        try {
            createBucket(bucketName);
            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(objectName)
                                .stream(inputStream, file.getSize(), -1)
                                .contentType(file.getContentType())
                                .build()
                );
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao enviar arquivo: " + objectName, e);
        }
    }

    public InputStream getFile(String bucketName, String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Arquivo não encontrado: " + objectName, e);
        }
    }

    public void deleteFile(String bucketName, String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao excluir arquivo: " + objectName, e);
        }
    }

    public List<String> listFiles(String bucketName) {
        try {
            createBucket(bucketName);
            Iterable<Result<Item>> results = minioClient.listObjects(
                    ListObjectsArgs.builder()
                            .bucket(bucketName)
                            .recursive(true)
                            .build()
            );
            return StreamSupport.stream(results.spliterator(), false)
                    .map(result -> {
                        try {
                            return result.get().objectName();
                        } catch (Exception e) {
                            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao listar arquivos", e);
                        }
                    })
                    .collect(Collectors.toList());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao listar arquivos", e);
        }
    }
}
