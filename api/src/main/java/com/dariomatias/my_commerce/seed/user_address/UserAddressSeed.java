package com.dariomatias.my_commerce.seed.user_address;

import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.UserAddressRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.seed.Seed;
import jakarta.transaction.Transactional;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
public class UserAddressSeed implements Seed {

    private static final Logger log = LoggerFactory.getLogger(UserAddressSeed.class);

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final Random random = new Random();

    private static final List<String> STREETS = List.of(
            "Rua das Flores",
            "Avenida Paulista",
            "Rua Dom Pedro I",
            "Rua Sete de Setembro",
            "Avenida Brasil",
            "Rua São João",
            "Rua Tiradentes"
    );

    private static final List<String> NEIGHBORHOODS = List.of(
            "Centro",
            "Jardim América",
            "Vila Mariana",
            "Bela Vista",
            "Moema",
            "Ipiranga"
    );

    private static final List<CityMock> CITIES = List.of(
            new CityMock("São Paulo", "SP", "01000-000", -46.6333, -23.5505),
            new CityMock("Rio de Janeiro", "RJ", "20000-000", -43.1729, -22.9068),
            new CityMock("Belo Horizonte", "MG", "30000-000", -43.9378, -19.9208),
            new CityMock("Curitiba", "PR", "80000-000", -49.2733, -25.4284)
    );

    public UserAddressSeed(
            UserRepository userRepository,
            UserAddressRepository userAddressRepository
    ) {
        this.userRepository = userRepository;
        this.userAddressRepository = userAddressRepository;
    }

    @Override
    @Transactional
    public void run() {
        log.info("USER_ADDRESS_SEED | Iniciando criação de endereços");
        createAddresses();
        log.info("USER_ADDRESS_SEED | Finalizada criação de endereços");
    }

    public void createAddresses() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            if (!userAddressRepository
                    .findAllByUser_IdAndDeletedAtIsNull(user.getId())
                    .isEmpty()) {
                log.info("USER_ADDRESS_SEED | Usuário já possui endereços: {}", user.getEmail());

                continue;
            }

            int addressCount = 1 + random.nextInt(3);
            log.info("USER_ADDRESS_SEED | Criando {} endereços para o usuário: {}", addressCount, user.getEmail());

            for (int i = 1; i <= addressCount; i++) {
                CityMock city = CITIES.get(random.nextInt(CITIES.size()));

                UserAddress address = new UserAddress();
                address.setUser(user);
                address.setLabel(i == 1 ? "Casa" : "Trabalho");
                address.setStreet(randomItem(STREETS));
                address.setNumber(String.valueOf(50 + random.nextInt(900)));
                address.setComplement(random.nextBoolean() ? "Apto " + (10 + random.nextInt(200)) : null);
                address.setNeighborhood(randomItem(NEIGHBORHOODS));
                address.setCity(city.city());
                address.setState(city.state());
                address.setZip(city.zip());
                address.setLocation(mockPoint(city.lon(), city.lat()));

                userAddressRepository.save(address);

                log.info(
                        "USER_ADDRESS_SEED | Endereço criado: Usuário: {} | Label: {} | Rua: {} | Número: {} | Cidade: {}",
                        user.getEmail(),
                        address.getLabel(),
                        address.getStreet(),
                        address.getNumber(),
                        address.getCity()
                );
            }
        }
    }

    private Point mockPoint(double lon, double lat) {
        double offsetLon = (random.nextDouble() - 0.5) * 0.02;
        double offsetLat = (random.nextDouble() - 0.5) * 0.02;

        return geometryFactory.createPoint(
                new Coordinate(lon + offsetLon, lat + offsetLat)
        );
    }

    private <T> T randomItem(List<T> list) {
        return list.get(random.nextInt(list.size()));
    }

    private record CityMock(
            String city,
            String state,
            String zip,
            double lon,
            double lat
    ) {}
}
