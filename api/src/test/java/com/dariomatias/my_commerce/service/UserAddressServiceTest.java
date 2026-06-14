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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
                "Casa",
                "Rua das Flores",
                "123",
                null,
                "Centro",
                "São Paulo",
                "SP",
                "01310-100",
                -23.5505,
                -46.6333
        );
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("endereço não encontrado deve lançar IllegalArgumentException")
        void enderecoNaoEncontrado_deveLancarException() {
            when(repository.findById(addressId)).thenReturn(Optional.empty());

            assertThrows(IllegalArgumentException.class,
                    () -> userAddressService.update(user, addressId, request));
        }

        @Test
        @DisplayName("endereço pertencente a outro usuário deve lançar IllegalArgumentException")
        void enderecoDeOutroUsuario_deveLancarException() {
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
        @DisplayName("proprietário atualiza endereço e retorna DTO")
        void proprietarioAtualiza_deveRetornarDTO() {
            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setUser(user);

            when(repository.findById(addressId)).thenReturn(Optional.of(address));

            UserAddressResponseDTO result = userAddressService.update(user, addressId, request);

            assertNotNull(result);
            assertEquals("Casa", result.getLabel());
            assertEquals("São Paulo", result.getCity());
            verify(repository).update(address);
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("endereço pertencente a outro usuário deve lançar IllegalArgumentException")
        void enderecoDeOutroUsuario_deveLancarException() {
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
        @DisplayName("proprietário deleta endereço com soft delete")
        void proprietarioDeletaComSoftDelete() {
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
