package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.dto.user.UserRequest;
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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    @DisplayName("getAll")
    class GetAll {

        @Test
        @DisplayName("should delegate to repository with filter and pageable")
        void shouldDelegateToRepository() {
            UserFilterDTO filter = new UserFilterDTO();
            Pageable pageable = Pageable.ofSize(10);
            @SuppressWarnings("unchecked")
            Page<User> page = mock(Page.class);
            when(userRepository.findAll(filter, pageable)).thenReturn(page);

            Page<User> result = userService.getAll(filter, pageable);

            assertEquals(page, result);
            verify(userRepository).findAll(filter, pageable);
        }
    }

    @Nested
    @DisplayName("getActiveUsersCount")
    class GetActiveUsersCount {

        @Test
        @DisplayName("should delegate count to repository")
        void shouldDelegateCountToRepository() {
            when(userRepository.countByEnabledTrueAndDeletedAtIsNull()).thenReturn(42L);

            long count = userService.getActiveUsersCount();

            assertEquals(42L, count);
            verify(userRepository).countByEnabledTrueAndDeletedAtIsNull();
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("user not found should throw 404")
        void userNotFound_shouldThrow404() {
            when(userRepository.findById(targetId)).thenReturn(Optional.empty());

            UserRequest request = new UserRequest();
            request.setName("New Name");

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> userService.update(adminUser, targetId, request));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verify(userRepository, never()).update(any());
        }

        @Test
        @DisplayName("valid name in request should update user name")
        void validName_shouldUpdateUserName() {
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(userRepository.update(targetUser)).thenReturn(targetUser);

            UserRequest request = new UserRequest();
            request.setName("Updated Name");

            userService.update(adminUser, targetId, request);

            assertEquals("Updated Name", targetUser.getName());
            verify(userRepository).update(targetUser);
        }

        @Test
        @DisplayName("null name in request should not change user name")
        void nullName_shouldNotChangeUserName() {
            targetUser.setName("Original Name");
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(userRepository.update(targetUser)).thenReturn(targetUser);

            UserRequest request = new UserRequest();
            request.setName(null);

            userService.update(adminUser, targetId, request);

            assertEquals("Original Name", targetUser.getName());
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("user not found should throw 404")
        void userNotFound_shouldThrow404() {
            when(userRepository.findById(targetId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> userService.getById(regularUser, targetId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("deleted user with ADMIN role should return user")
        void deletedUserWithAdminRole_shouldReturnUser() {
            targetUser.delete();
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));

            User result = userService.getById(adminUser, targetId);

            assertNotNull(result);
            assertEquals(targetId, result.getId());
            assertTrue(result.isDeleted());
        }

        @Test
        @DisplayName("deleted user with USER role should throw 404")
        void deletedUserWithUserRole_shouldThrow404() {
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
        @DisplayName("wrong current password should throw 400")
        void wrongCurrentPassword_shouldThrow400() {
            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> userService.changePassword(adminUser, targetId, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(userRepository, never()).update(any());
        }

        @Test
        @DisplayName("correct current password should update user password")
        void correctCurrentPassword_shouldUpdatePassword() {
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
        @DisplayName("should cascade delete stores, products and MinIO folder")
        void shouldCascadeDeleteStoresProductsAndMinIO() {
            Store store1 = new Store();
            store1.setId(UUID.randomUUID());
            store1.setSlug("store-one");

            Store store2 = new Store();
            store2.setId(UUID.randomUUID());
            store2.setSlug("store-two");

            when(userRepository.findById(targetId)).thenReturn(Optional.of(targetUser));
            when(storeRepository.findAllByUserId(targetId)).thenReturn(List.of(store1, store2));
            when(redisTemplate.keys("*")).thenReturn(Collections.emptySet());
            when(userRepository.update(targetUser)).thenReturn(targetUser);

            userService.delete(adminUser, targetId);

            verify(minioService).deleteFolder("stores", "store-one/");
            verify(minioService).deleteFolder("stores", "store-two/");
            verify(productRepository).deleteByStoreId(store1.getId());
            verify(productRepository).deleteByStoreId(store2.getId());
            verify(storeRepository).deleteByUserId(targetId);
            verify(userRepository).update(targetUser);
            assertTrue(targetUser.isDeleted());
        }
    }
}
