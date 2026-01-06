package com.dariomatias.my_commerce.dto.freight;

import com.dariomatias.my_commerce.enums.FreightType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FreightOptionDTO {
    private BigDecimal value;
    private int estimatedDays;
    private FreightType type;

    public FreightOptionDTO(BigDecimal value, int estimatedDays, FreightType type) {
        this.value = value;
        this.estimatedDays = estimatedDays;
        this.type = type;
    }
}
