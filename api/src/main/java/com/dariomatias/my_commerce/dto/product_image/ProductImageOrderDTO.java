package com.dariomatias.my_commerce.dto.product_image;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ProductImageOrderDTO {

    private UUID id;
    private String url;
}
