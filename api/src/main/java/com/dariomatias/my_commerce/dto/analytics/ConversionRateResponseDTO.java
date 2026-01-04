package com.dariomatias.my_commerce.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConversionRateResponseDTO {

    private long visitors;
    private long conversions;
    private double conversionRate;
}
