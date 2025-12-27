package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {

    List<ProductImage> findAllByProduct_IdOrderByPositionAsc(UUID productId);

    void deleteAllByProduct_Id(UUID productId);
}
