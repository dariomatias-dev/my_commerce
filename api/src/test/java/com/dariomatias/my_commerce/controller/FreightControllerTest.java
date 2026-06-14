package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.dto.freight.FreightOptionDTO;
import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.service.FreightService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(FreightController.class)
class FreightControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FreightService freightService;

    @Nested
    @DisplayName("GET /api/freight/{userAddressId}")
    class CalculateFreight {

        @Test
        @DisplayName("should return freight options for valid address")
        void shouldReturnFreightOptionsForAddress() throws Exception {
            UUID addressId = UUID.randomUUID();

            FreightOptionDTO economical = new FreightOptionDTO(BigDecimal.valueOf(15.00), 7, FreightType.ECONOMICAL);
            FreightOptionDTO express = new FreightOptionDTO(BigDecimal.valueOf(30.00), 3, FreightType.EXPRESS);
            FreightResponseDTO response = new FreightResponseDTO(economical, express);

            when(freightService.calculateFreight(eq(addressId))).thenReturn(response);

            mockMvc.perform(get("/api/freight/{userAddressId}", addressId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Frete calculado com sucesso"))
                    .andExpect(jsonPath("$.data.economical.estimatedDays").value(7))
                    .andExpect(jsonPath("$.data.express.estimatedDays").value(3));

            verify(freightService).calculateFreight(addressId);
        }
    }
}
