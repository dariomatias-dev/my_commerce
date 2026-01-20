package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.ProductImage;

import java.util.List;
import java.util.UUID;

public interface ProductImageContract {

    ProductImage save(ProductImage image);

    List<ProductImage> findAllByProduct(UUID productId);

    void delete(ProductImage image);
}
