package com.dariomatias.my_commerce.dto.freight;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FreightResponseDTO {
    private FreightOptionDTO economical;
    private FreightOptionDTO express;

    public FreightResponseDTO(FreightOptionDTO economical, FreightOptionDTO express) {
        this.economical = economical;
        this.express = express;
    }
}
