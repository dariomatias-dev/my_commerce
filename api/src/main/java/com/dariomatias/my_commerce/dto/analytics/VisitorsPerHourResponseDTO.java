package com.dariomatias.my_commerce.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VisitorsPerHourResponseDTO {

    private String hour;
    private long count;
}
