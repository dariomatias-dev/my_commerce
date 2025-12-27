package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.ProductImage;

import java.util.List;
import java.util.UUID;

public interface ProductImageContract {

    List<ProductImage> findAllByProduct(UUID productId);

    void deleteAllByProduct(UUID productId);

    ProductImage save(ProductImage image);

    void delete(ProductImage image);
}
