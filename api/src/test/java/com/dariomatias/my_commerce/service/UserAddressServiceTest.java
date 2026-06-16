package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.address.UserAddressRequestDTO;
import com.dariomatias.my_commerce.dto.address.UserAddressResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserAddressService")
class UserAddressServiceTest {

    @Mock
    private UserAddressContract repository;

    @InjectMocks
    private UserAddressService userAddressService;

    private User user;
    private UUID addressId;
    private UserAddressRequestDTO request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());

        addressId = UUID.randomUUID();

        request = new UserAddressRequestDTO(
                "Home",
                "Flower Street",
                "123",
                null,
                "Downtown",
                "Sao Paulo",
                "SP",
                "01310-100",
                -23.5505,
                -46.6333
        );
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("should save address and return DTO")
        void shouldSaveAndReturnDTO() {
            GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
            Point location = gf.createPoint(new Coordinate(-46.6333, -23.5505));

            UserAddress saved = new UserAddress();
            saved.setId(addressId);
            saved.setLabel("Home");
            saved.setCity("Sao Paulo");
            saved.setLocation(location);
            saved.setUser(user);

            when(repository.save(any(UserAddress.class))).thenReturn(saved);

            UserAddressResponseDTO result = userAddressService.create(user, request);

            assertNotNull(result);
            assertEquals("Home", result.getLabel());
            assertEquals("Sao Paulo", result.getCity());
            verify(repository).save(any(UserAddress.class));
        }
    }

    @Nested
    @DisplayName("getAllByUser")
    class GetAllByUser {

        @Test
        @DisplayName("no addresses should return empty list")
        void noAddresses_shouldReturnEmpty() {
            when(repository.findAllByUserId(user.getId())).thenReturn(List.of());

            List<UserAddressResponseDTO> result = userAddressService.getAllByUser(user);

            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("with addresses should return mapped DTOs")
        void withAddresses_shouldReturnMappedDTOs() {
            GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
            Point location = gf.createPoint(new Coordinate(-46.6333, -23.5505));

            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setLabel("Home");
            address.setCity("Sao Paulo");
            address.setLocation(location);
            address.setUser(user);

            when(repository.findAllByUserId(user.getId())).thenReturn(List.of(address));

            List<UserAddressResponseDTO> result = userAddressService.getAllByUser(user);

            assertEquals(1, result.size());
            assertEquals("Home", result.get(0).getLabel());
            assertEquals("Sao Paulo", result.get(0).getCity());
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("address not found should throw IllegalArgumentException")
        void addressNotFound_shouldThrowException() {
            when(repository.findById(addressId)).thenReturn(Optional.empty());

            assertThrows(IllegalArgumentException.class,
                    () -> userAddressService.update(user, addressId, request));
        }

        @Test
        @DisplayName("address belonging to another user should throw IllegalArgumentException")
        void addressBelongsToOtherUser_shouldThrowException() {
            User otherUser = new User();
            otherUser.setId(UUID.randomUUID());

            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setUser(otherUser);

            when(repository.findById(addressId)).thenReturn(Optional.of(address));

            assertThrows(IllegalArgumentException.class,
                    () -> userAddressService.update(user, addressId, request));

            verify(repository, never()).update(any());
        }

        @Test
        @DisplayName("owner should update address and return DTO")
        void owner_shouldUpdateAndReturnDTO() {
            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setUser(user);

            when(repository.findById(addressId)).thenReturn(Optional.of(address));

            UserAddressResponseDTO result = userAddressService.update(user, addressId, request);

            assertNotNull(result);
            assertEquals("Home", result.getLabel());
            assertEquals("Sao Paulo", result.getCity());
            verify(repository).update(address);
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("address belonging to another user should throw IllegalArgumentException")
        void addressBelongsToOtherUser_shouldThrowException() {
            User otherUser = new User();
            otherUser.setId(UUID.randomUUID());

            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setUser(otherUser);

            when(repository.findById(addressId)).thenReturn(Optional.of(address));

            assertThrows(IllegalArgumentException.class,
                    () -> userAddressService.delete(user, addressId));

            verify(repository, never()).update(any());
        }

        @Test
        @DisplayName("owner should soft delete address")
        void owner_shouldSoftDelete() {
            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setUser(user);

            when(repository.findById(addressId)).thenReturn(Optional.of(address));

            userAddressService.delete(user, addressId);

            assertTrue(address.isDeleted());
            verify(repository).update(address);
        }
    }
}
