package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.address.UserAddressRequestDTO;
import com.dariomatias.my_commerce.dto.address.UserAddressResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.UserAddressService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(UserAddressController.class)
@Import(TestWebMvcConfig.class)
class UserAddressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserAddressService service;

    private UUID addressId;
    private User mockUser;
    private UserAddressResponseDTO addressResponse;
    private UserAddressRequestDTO addressRequest;

    @BeforeEach
    void setUp() {
        addressId = UUID.randomUUID();

        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("hashedpassword");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, List.of())
        );

        addressResponse = new UserAddressResponseDTO(
                addressId, "Home", "Flower Street", "123", null,
                "Downtown", "Joao Pessoa", "PB", "58000-000",
                -7.1195, -34.8450, LocalDateTime.now(), LocalDateTime.now()
        );

        addressRequest = new UserAddressRequestDTO(
                "Home", "Flower Street", "123", null,
                "Downtown", "Joao Pessoa", "PB", "58000-000",
                -7.1195, -34.8450
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("POST /api/addresses")
    class Create {

        @Test
        @DisplayName("should create address")
        void shouldCreateAddress() throws Exception {
            when(service.create(any(User.class), any(UserAddressRequestDTO.class))).thenReturn(addressResponse);

            mockMvc.perform(post("/api/addresses")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(addressRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(addressId.toString()))
                    .andExpect(jsonPath("$.data.label").value("Home"))
                    .andExpect(jsonPath("$.data.city").value("Joao Pessoa"));

            verify(service).create(any(User.class), any(UserAddressRequestDTO.class));
        }

        @Test
        @DisplayName("should return 400 when request is invalid")
        void shouldReturn400WhenCreateRequestInvalid() throws Exception {
            mockMvc.perform(post("/api/addresses")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/addresses")
    class GetAll {

        @Test
        @DisplayName("should return address list for authenticated user")
        void shouldReturnAddressListForUser() throws Exception {
            when(service.getAllByUser(any(User.class))).thenReturn(List.of(addressResponse));

            mockMvc.perform(get("/api/addresses"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data[0].id").value(addressId.toString()))
                    .andExpect(jsonPath("$.data[0].street").value("Flower Street"));

            verify(service).getAllByUser(any(User.class));
        }
    }

    @Nested
    @DisplayName("PUT /api/addresses/{id}")
    class Update {

        @Test
        @DisplayName("should update address by ID")
        void shouldUpdateAddress() throws Exception {
            UserAddressRequestDTO updateRequest = new UserAddressRequestDTO(
                    "Work", "Av. Epitacio Pessoa", "1000", "Room 5",
                    "Tambau", "Joao Pessoa", "PB", "58039-000",
                    -7.1120, -34.8370
            );
            UserAddressResponseDTO updatedResponse = new UserAddressResponseDTO(
                    addressId, "Work", "Av. Epitacio Pessoa", "1000", "Room 5",
                    "Tambau", "Joao Pessoa", "PB", "58039-000",
                    -7.1120, -34.8370, LocalDateTime.now(), LocalDateTime.now()
            );

            when(service.update(any(User.class), eq(addressId), any(UserAddressRequestDTO.class))).thenReturn(updatedResponse);

            mockMvc.perform(put("/api/addresses/{id}", addressId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.label").value("Work"))
                    .andExpect(jsonPath("$.data.street").value("Av. Epitacio Pessoa"));

            verify(service).update(any(User.class), eq(addressId), any(UserAddressRequestDTO.class));
        }

        @Test
        @DisplayName("should return 400 when request is invalid")
        void shouldReturn400WhenUpdateRequestInvalid() throws Exception {
            mockMvc.perform(put("/api/addresses/{id}", addressId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("DELETE /api/addresses/{id}")
    class Delete {

        @Test
        @DisplayName("should delete address by ID")
        void shouldDeleteAddress() throws Exception {
            doNothing().when(service).delete(any(User.class), eq(addressId));

            mockMvc.perform(delete("/api/addresses/{id}", addressId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Endereço excluído com sucesso."));

            verify(service).delete(any(User.class), eq(addressId));
        }
    }
}
