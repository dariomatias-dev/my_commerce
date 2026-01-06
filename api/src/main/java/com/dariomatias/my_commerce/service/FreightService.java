package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.freight.FreightOptionDTO;
import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
public class FreightService {

    private final UserAddressContract userAddressRepository;

    public FreightService(UserAddressContract userAddressRepository) {
        this.userAddressRepository = userAddressRepository;
    }

    public FreightResponseDTO calculateFreight(UUID userAddressId) {

        userAddressRepository.findById(userAddressId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Endereço do usuário não encontrado"
                        )
                );

        BigDecimal saoPauloLat = BigDecimal.valueOf(-23.55052);
        BigDecimal saoPauloLon = BigDecimal.valueOf(-46.633308);

        Double distanceMetersRaw = userAddressRepository.calculateDistanceFromPoint(
                userAddressId,
                saoPauloLat.doubleValue(),
                saoPauloLon.doubleValue()
        );

        if (distanceMetersRaw == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível calcular a distância do endereço"
            );
        }

        BigDecimal distanceMeters = BigDecimal.valueOf(distanceMetersRaw);

        BigDecimal distanceKm = distanceMeters.divide(
                BigDecimal.valueOf(1000),
                4,
                RoundingMode.HALF_UP
        );

        BigDecimal freeDistanceKm = BigDecimal.valueOf(5);
        BigDecimal economicRatePerKm = BigDecimal.valueOf(0.05);
        BigDecimal expressRatePerKm = BigDecimal.valueOf(0.15);

        BigDecimal economicValue = BigDecimal.ZERO;
        BigDecimal expressValue = BigDecimal.ZERO;

        if (distanceKm.compareTo(freeDistanceKm) > 0) {
            BigDecimal chargeableKm = distanceKm.subtract(freeDistanceKm);

            economicValue = chargeableKm.multiply(economicRatePerKm);
            expressValue = chargeableKm.multiply(expressRatePerKm);
        }

        economicValue = economicValue.setScale(2, RoundingMode.HALF_UP);
        expressValue = expressValue.setScale(2, RoundingMode.HALF_UP);

        FreightOptionDTO economic = new FreightOptionDTO(
                economicValue,
                5,
                FreightType.ECONOMICAL
        );

        FreightOptionDTO express = new FreightOptionDTO(
                expressValue,
                2,
                FreightType.EXPRESS
        );

        return new FreightResponseDTO(economic, express);
    }
}
