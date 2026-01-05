package com.dariomatias.my_commerce.dto.freight;

import com.dariomatias.my_commerce.enums.FreightType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FreightOptionDTO {
    private double value;
    private int estimatedDays;
    private FreightType type;

    public FreightOptionDTO(double value, int estimatedDays, FreightType type) {
        this.value = value;
        this.estimatedDays = estimatedDays;
        this.type = type;
    }
}
