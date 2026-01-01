package com.dariomatias.my_commerce.dto.product;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ProductFilterDTO {

    private UUID categoryId;

    private Integer lowStockThreshold;
}
