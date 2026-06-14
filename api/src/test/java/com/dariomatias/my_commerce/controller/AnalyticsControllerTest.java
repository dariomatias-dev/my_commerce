package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.analytics.TotalRevenueResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.UniqueCustomersResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.AnalyticsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(AnalyticsController.class)
@Import(TestWebMvcConfig.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AnalyticsService service;

    private UUID userId;
    private UUID storeId;
    private User mockUser;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        storeId = UUID.randomUUID();

        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("hashedpassword");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, List.of())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("GET /api/analytics/me/stats/unique-customers")
    class GetUniqueCustomers {

        @Test
        @DisplayName("should return unique customers for authenticated user")
        void shouldReturnUniqueCustomersForUser() throws Exception {
            UniqueCustomersResponseDTO response = new UniqueCustomersResponseDTO(25L);
            when(service.getUniqueCustomers(eq(userId))).thenReturn(response);

            mockMvc.perform(get("/api/analytics/me/stats/unique-customers"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.total").value(25));

            verify(service).getUniqueCustomers(userId);
        }
    }

    @Nested
    @DisplayName("GET /api/analytics/me/stats/total-revenue")
    class GetTotalRevenue {

        @Test
        @DisplayName("should return total revenue for authenticated user")
        void shouldReturnTotalRevenueForUser() throws Exception {
            TotalRevenueResponseDTO response = new TotalRevenueResponseDTO(BigDecimal.valueOf(1500.00));
            when(service.getTotalRevenue(eq(userId))).thenReturn(response);

            mockMvc.perform(get("/api/analytics/me/stats/total-revenue"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.total").value(1500.0));

            verify(service).getTotalRevenue(userId);
        }
    }

    @Nested
    @DisplayName("GET /api/analytics/store/{storeId}/stats/unique-customers")
    class GetUniqueCustomersByStore {

        @Test
        @DisplayName("should return unique customers for store")
        void shouldReturnUniqueCustomersForStore() throws Exception {
            UniqueCustomersResponseDTO response = new UniqueCustomersResponseDTO(10L);
            when(service.getUniqueCustomersByStore(eq(storeId), any(User.class))).thenReturn(response);

            mockMvc.perform(get("/api/analytics/store/{storeId}/stats/unique-customers", storeId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.total").value(10));

            verify(service).getUniqueCustomersByStore(eq(storeId), any(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/analytics/store/{storeId}/stats/total-revenue")
    class GetTotalRevenueByStore {

        @Test
        @DisplayName("should return total revenue for store")
        void shouldReturnTotalRevenueForStore() throws Exception {
            TotalRevenueResponseDTO response = new TotalRevenueResponseDTO(BigDecimal.valueOf(3200.50));
            when(service.getTotalRevenueByStore(eq(storeId), any(User.class))).thenReturn(response);

            mockMvc.perform(get("/api/analytics/store/{storeId}/stats/total-revenue", storeId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.total").value(3200.5));

            verify(service).getTotalRevenueByStore(eq(storeId), any(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/analytics/total-revenue")
    class GetTotalRevenueGlobal {

        @Test
        @DisplayName("should return global total revenue")
        void shouldReturnGlobalTotalRevenue() throws Exception {
            when(service.getTotalRevenue()).thenReturn(BigDecimal.valueOf(99999.99));

            mockMvc.perform(get("/api/analytics/total-revenue"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.total").value(99999.99));

            verify(service).getTotalRevenue();
        }
    }
}
