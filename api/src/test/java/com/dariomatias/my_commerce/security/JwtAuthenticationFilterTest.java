package com.dariomatias.my_commerce.security;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JwtAuthenticationFilter")
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private User user;

    private static final String VALID_TOKEN = "valid.jwt.token";
    private static final UUID USER_ID = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();

        user = new User();
        user.setId(USER_ID);
        user.setRole(UserRole.USER);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("no Authorization header and no cookie should continue chain without authentication")
    void doFilter_noHeaderNoCookie_shouldContinueWithoutAuth() throws Exception {
        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("valid Bearer token with existing user should set authentication in SecurityContext")
    void doFilter_validBearerToken_userFound_shouldSetAuthentication() throws Exception {
        request.addHeader("Authorization", "Bearer " + VALID_TOKEN);
        when(jwtService.validateToken(VALID_TOKEN)).thenReturn(true);
        when(jwtService.getIdFromToken(VALID_TOKEN)).thenReturn(USER_ID.toString());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals(user, auth.getPrincipal());
    }

    @Test
    @DisplayName("valid token from cookie with existing user should set authentication in SecurityContext")
    void doFilter_validCookieToken_userFound_shouldSetAuthentication() throws Exception {
        request.setCookies(new Cookie("token", VALID_TOKEN));
        when(jwtService.validateToken(VALID_TOKEN)).thenReturn(true);
        when(jwtService.getIdFromToken(VALID_TOKEN)).thenReturn(USER_ID.toString());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals(user, auth.getPrincipal());
    }

    @Test
    @DisplayName("invalid token should continue chain without authentication")
    void doFilter_invalidToken_shouldContinueWithoutAuth() throws Exception {
        request.addHeader("Authorization", "Bearer invalid.token");
        when(jwtService.validateToken("invalid.token")).thenReturn(false);

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("valid token but user not found in DB should return 401 and not continue chain")
    void doFilter_validToken_userNotFound_shouldReturn401AndNotContinueChain() throws Exception {
        request.addHeader("Authorization", "Bearer " + VALID_TOKEN);
        when(jwtService.validateToken(VALID_TOKEN)).thenReturn(true);
        when(jwtService.getIdFromToken(VALID_TOKEN)).thenReturn(USER_ID.toString());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

        filter.doFilter(request, response, filterChain);

        verify(filterChain, never()).doFilter(any(), any());
        assertEquals(401, response.getStatus());
        assertEquals("application/json", response.getContentType());
        assertTrue(response.getContentAsString().contains("Token inválido ou usuário deletado"));
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("Authorization header without Bearer prefix should not attempt token validation")
    void doFilter_authHeaderWithoutBearerPrefix_shouldNotValidateToken() throws Exception {
        request.addHeader("Authorization", "Basic dXNlcjpwYXNz");

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService, never()).validateToken(any());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("cookies present but none named 'token' should not attempt token validation")
    void doFilter_cookiesWithoutTokenCookie_shouldNotValidateToken() throws Exception {
        request.setCookies(new Cookie("session", "abc"), new Cookie("other", "xyz"));

        filter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(jwtService, never()).validateToken(any());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("valid token should set role as granted authority on authentication")
    void doFilter_validToken_shouldSetCorrectRoleAuthority() throws Exception {
        user.setRole(UserRole.ADMIN);
        request.addHeader("Authorization", "Bearer " + VALID_TOKEN);
        when(jwtService.validateToken(VALID_TOKEN)).thenReturn(true);
        when(jwtService.getIdFromToken(VALID_TOKEN)).thenReturn(USER_ID.toString());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

        filter.doFilter(request, response, filterChain);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertTrue(
                auth.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
        );
    }

    @Test
    @DisplayName("Bearer header takes precedence over cookie when both are present")
    void doFilter_bearerHeaderAndCookiePresent_shouldUseBearerToken() throws Exception {
        String cookieToken = "cookie.jwt.token";
        request.addHeader("Authorization", "Bearer " + VALID_TOKEN);
        request.setCookies(new Cookie("token", cookieToken));
        when(jwtService.validateToken(VALID_TOKEN)).thenReturn(true);
        when(jwtService.getIdFromToken(VALID_TOKEN)).thenReturn(USER_ID.toString());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

        filter.doFilter(request, response, filterChain);

        verify(jwtService).validateToken(VALID_TOKEN);
        verify(jwtService, never()).validateToken(cookieToken);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
