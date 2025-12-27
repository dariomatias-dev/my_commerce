package com.dariomatias.my_commerce.dto.product_image;

import com.dariomatias.my_commerce.model.ProductImage;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ProductImageResponseDTO {

    private UUID id;
    private String url;
    private Integer position;

    public static ProductImageResponseDTO from(ProductImage image) {
        ProductImageResponseDTO dto = new ProductImageResponseDTO();
        dto.id = image.getId();
        dto.url = image.getUrl();
        dto.position = image.getPosition();
        return dto;
    }
}
