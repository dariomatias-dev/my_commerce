package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.freight.FreightOptionDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FreightService {

    private final UserAddressContract userAddressRepository;

    public FreightService(UserAddressContract userAddressRepository) {
        this.userAddressRepository = userAddressRepository;
    }

    public FreightResponseDTO calculateFreight(UUID userAddressId) {
        UserAddress address = userAddressRepository.findById(userAddressId)
                .orElseThrow(() -> new RuntimeException("Endereço do usuário não encontrado"));

        double saoPauloLat = -23.55052;
        double saoPauloLon = -46.633308;

        Double distanceMeters = userAddressRepository.calculateDistanceFromPoint(
                userAddressId, saoPauloLat, saoPauloLon
        );

        if (distanceMeters == null) {
            throw new RuntimeException("Endereço do usuário não encontrado");
        }

        double distanceKm = distanceMeters / 1000.0;

        double FREE_DISTANCE_KM = 5.0;
        double economicRatePerKm = 0.05;
        double expressRatePerKm = 0.15;

        double economicValue = 0.0;
        double expressValue = 0.0;

        if (distanceKm > FREE_DISTANCE_KM) {
            economicValue = (distanceKm - FREE_DISTANCE_KM) * economicRatePerKm;
            expressValue = (distanceKm - FREE_DISTANCE_KM) * expressRatePerKm;
        }

        economicValue = Math.round(economicValue * 100.0) / 100.0;
        expressValue = Math.round(expressValue * 100.0) / 100.0;

        FreightOptionDTO economic = new FreightOptionDTO(economicValue, 5, FreightType.ECONOMICAL);
        FreightOptionDTO express = new FreightOptionDTO(expressValue, 2, FreightType.EXPRESS);

        return new FreightResponseDTO(economic, express);
    }
}
