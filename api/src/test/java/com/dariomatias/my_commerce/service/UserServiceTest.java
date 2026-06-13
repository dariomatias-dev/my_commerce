package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService")
class UserServiceTest {

    @Mock
    private UserContract userRepository;

    @Mock
    private StoreContract storeRepository;

    @Mock
    private ProductContract productRepository;

    @SuppressWarnings("unchecked")
    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private MinioService minioService;

    @InjectMocks
    private UserService userService;

    private User adminUser;
    private User regularUser;
    private User targetUser;
    private UUID targetId;

    @BeforeEach
    void setUp() {
        targetId = UUID.randomUUID();

        adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setRole(UserRole.ADMIN);

        regularUser = new User();
        regularUser.setId(UUID.randomUUID());
        regularUser.setRole(UserRole.USER);

        targetUser = new User();
        targetUser.setId(targetId);
        targetUser.setRole(UserRole.USER);
        targetUser.setEnabled(true);
        targetUser.setPassword("encoded-password");
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("usuário não encontrado deve lançar 404")
        void usuarioNaoEncontrado_deveLancar404() {
            when(userRepository.findById(targetId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> userService.getById(regularUser, targetId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("usuário deletado com role ADMIN deve retornar usuário")
        void usuarioDeletadoComAdmin_deveRetornarUsuario() {
            targetUser.delete();
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));

            User result = userService.getById(adminUser, targetId);

            assertNotNull(result);
            assertEquals(targetId, result.getId());
            assertTrue(result.isDeleted());
        }

        @Test
        @DisplayName("usuário deletado com role USER deve lançar 404")
        void usuarioDeletadoComUser_deveLancar404() {
            targetUser.delete();
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> userService.getById(regularUser, targetId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("changePassword")
    class ChangePassword {

        private PasswordUpdateRequest request;

        @BeforeEach
        void setUp() {
            request = new PasswordUpdateRequest();
            request.setCurrentPassword("wrong-password");
            request.setNewPassword("NewPassword@1");
        }

        @Test
        @DisplayName("senha atual incorreta deve lançar 400")
        void senhaAtualIncorreta_deveLancar400() {
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> userService.changePassword(adminUser, targetId, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(userRepository, never()).update(any());
        }

        @Test
        @DisplayName("senha atual correta deve atualizar senha do usuário")
        void senhaAtualCorreta_deveAtualizarSenha() {
            request.setCurrentPassword("correct-password");
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(passwordEncoder.matches("correct-password", "encoded-password")).thenReturn(true);
            when(passwordEncoder.encode("NewPassword@1")).thenReturn("new-encoded-password");
            when(userRepository.update(targetUser)).thenReturn(targetUser);

            userService.changePassword(adminUser, targetId, request);

            assertEquals("new-encoded-password", targetUser.getPassword());
            verify(userRepository).update(targetUser);
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("deve deletar stores, products e pasta MinIO em cascata")
        void deveDeletarCascataStoresProductsMinIO() {
            Store store1 = new Store();
            store1.setId(UUID.randomUUID());
            store1.setSlug("loja-um");

            Store store2 = new Store();
            store2.setId(UUID.randomUUID());
            store2.setSlug("loja-dois");

            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(storeRepository.findAllByUserId(targetId)).thenReturn(List.of(store1, store2));
            when(redisTemplate.keys("*")).thenReturn(Collections.emptySet());
            when(userRepository.update(targetUser)).thenReturn(targetUser);

            userService.delete(adminUser, targetId);

            verify(minioService).deleteFolder("stores", "loja-um/");
            verify(minioService).deleteFolder("stores", "loja-dois/");
            verify(productRepository).deleteByStoreId(store1.getId());
            verify(productRepository).deleteByStoreId(store2.getId());
            verify(storeRepository).deleteByUserId(targetId);
            verify(userRepository).update(targetUser);
            assertTrue(targetUser.isDeleted());
        }
    }
}
