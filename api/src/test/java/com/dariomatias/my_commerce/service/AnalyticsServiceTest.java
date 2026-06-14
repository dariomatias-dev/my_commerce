package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.analytics.TotalRevenueResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.UniqueCustomersResponseDTO;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AnalyticsService")
class AnalyticsServiceTest {

    @Mock
    private OrderContract orderRepository;

    @Mock
    private StoreContract storeRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private User user;
    private User adminUser;
    private UUID userId;
    private UUID storeId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        storeId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setRole(UserRole.USER);

        adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setRole(UserRole.ADMIN);
    }

    @Nested
    @DisplayName("getTotalRevenue(userId)")
    class GetTotalRevenueByUser {

        @Test
        @DisplayName("repository retorna null deve retornar ZERO")
        void repositoryRetornaNullDeveRetornarZero() {
            when(orderRepository.sumTotalRevenueByUserIdAndStatus(userId, Status.COMPLETED)).thenReturn(null);

            TotalRevenueResponseDTO result = analyticsService.getTotalRevenue(userId);

            assertEquals(BigDecimal.ZERO, result.total());
        }

        @Test
        @DisplayName("repository retorna valor deve encapsulá-lo no DTO")
        void repositoryRetornaValorDeveEncapsular() {
            BigDecimal revenue = new BigDecimal("1500.00");
            when(orderRepository.sumTotalRevenueByUserIdAndStatus(userId, Status.COMPLETED)).thenReturn(revenue);

            TotalRevenueResponseDTO result = analyticsService.getTotalRevenue(userId);

            assertEquals(revenue, result.total());
        }
    }

    @Nested
    @DisplayName("getTotalRevenue() global")
    class GetTotalRevenueGlobal {

        @Test
        @DisplayName("repository retorna null deve retornar ZERO")
        void repositoryRetornaNullDeveRetornarZero() {
            when(orderRepository.sumTotalRevenueByStatus(Status.COMPLETED)).thenReturn(null);

            BigDecimal result = analyticsService.getTotalRevenue();

            assertEquals(BigDecimal.ZERO, result);
        }

        @Test
        @DisplayName("repository retorna valor deve retorná-lo diretamente")
        void repositoryRetornaValorDeveRetornar() {
            BigDecimal revenue = new BigDecimal("9999.99");
            when(orderRepository.sumTotalRevenueByStatus(Status.COMPLETED)).thenReturn(revenue);

            BigDecimal result = analyticsService.getTotalRevenue();

            assertEquals(revenue, result);
        }
    }

    @Nested
    @DisplayName("verifyStoreAccess (via getUniqueCustomersByStore)")
    class VerifyStoreAccess {

        @Test
        @DisplayName("ADMIN bypassa verificação de propriedade")
        void adminBypassaVerificacao() {
            when(orderRepository.countDistinctCustomersByStoreIdAndStatus(storeId, Status.COMPLETED)).thenReturn(5L);

            UniqueCustomersResponseDTO result = analyticsService.getUniqueCustomersByStore(storeId, adminUser);

            assertEquals(5L, result.total());
            verifyNoInteractions(storeRepository);
        }

        @Test
        @DisplayName("loja não encontrada deve lançar 404")
        void lojaNaoEncontrada_deveLancar404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> analyticsService.getUniqueCustomersByStore(storeId, user));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("usuário não proprietário da loja deve lançar 403")
        void naoProprietario_deveLancar403() {
            Store store = new Store();
            store.setId(storeId);
            store.setUser(adminUser); // dono é outro

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> analyticsService.getUniqueCustomersByStore(storeId, user));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }
    }
}
