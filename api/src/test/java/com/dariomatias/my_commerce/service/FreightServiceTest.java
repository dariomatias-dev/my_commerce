package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FreightService")
class FreightServiceTest {

    @Mock
    private UserAddressContract userAddressRepository;

    @InjectMocks
    private FreightService freightService;

    private UUID addressId;
    private UserAddress address;

    @BeforeEach
    void setUp() {
        addressId = UUID.randomUUID();
        address = mock(UserAddress.class);
    }

    @Nested
    @DisplayName("calculateFreight")
    class CalculateFreight {

        @Test
        @DisplayName("endereço não encontrado deve lançar 404")
        void enderecoNaoEncontrado_deveLancar404() {
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> freightService.calculateFreight(addressId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("distância null deve lançar 400")
        void distanciaNull_deveLancar400() {
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(address));
            when(userAddressRepository.calculateDistanceFromPoint(eq(addressId), anyDouble(), anyDouble()))
                    .thenReturn(null);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> freightService.calculateFreight(addressId));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("distância menor que 5km deve retornar frete zero")
        void distanciaMenorQue5km_deveRetornarFreteZero() {
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(address));
            when(userAddressRepository.calculateDistanceFromPoint(eq(addressId), anyDouble(), anyDouble()))
                    .thenReturn(4000.0);

            FreightResponseDTO result = freightService.calculateFreight(addressId);

            assertEquals(new BigDecimal("0.00"), result.getEconomical().getValue());
            assertEquals(new BigDecimal("0.00"), result.getExpress().getValue());
        }

        @Test
        @DisplayName("distância exatamente 5km deve retornar frete zero")
        void distanciaExatamente5km_deveRetornarFreteZero() {
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(address));
            when(userAddressRepository.calculateDistanceFromPoint(eq(addressId), anyDouble(), anyDouble()))
                    .thenReturn(5000.0);

            FreightResponseDTO result = freightService.calculateFreight(addressId);

            assertEquals(new BigDecimal("0.00"), result.getEconomical().getValue());
            assertEquals(new BigDecimal("0.00"), result.getExpress().getValue());
        }

        @Test
        @DisplayName("distância > 5km deve calcular frete econômico: (km - 5) × 0.05")
        void distanciaMaiorQue5km_deveCalcularFreteEconomico() {
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(address));
            // 15km → 10km cobráveis → econômico = 10 × 0.05 = 0.50
            when(userAddressRepository.calculateDistanceFromPoint(eq(addressId), anyDouble(), anyDouble()))
                    .thenReturn(15000.0);

            FreightResponseDTO result = freightService.calculateFreight(addressId);

            assertEquals(new BigDecimal("0.50"), result.getEconomical().getValue());
            assertEquals(FreightType.ECONOMICAL, result.getEconomical().getType());
            assertEquals(5, result.getEconomical().getEstimatedDays());
        }

        @Test
        @DisplayName("distância > 5km deve calcular frete express: (km - 5) × 0.15")
        void distanciaMaiorQue5km_deveCalcularFreteExpress() {
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(address));
            // 15km → 10km cobráveis → express = 10 × 0.15 = 1.50
            when(userAddressRepository.calculateDistanceFromPoint(eq(addressId), anyDouble(), anyDouble()))
                    .thenReturn(15000.0);

            FreightResponseDTO result = freightService.calculateFreight(addressId);

            assertEquals(new BigDecimal("1.50"), result.getExpress().getValue());
            assertEquals(FreightType.EXPRESS, result.getExpress().getType());
            assertEquals(2, result.getExpress().getEstimatedDays());
        }
    }
}
