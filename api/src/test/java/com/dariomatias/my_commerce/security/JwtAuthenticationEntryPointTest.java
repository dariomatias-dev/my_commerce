package com.dariomatias.my_commerce.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@DisplayName("JwtAuthenticationEntryPoint")
class JwtAuthenticationEntryPointTest {

    private final JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();

    @Test
    @DisplayName("commence should return 401 with JSON content type")
    void commence_shouldReturn401WithJsonContentType() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException ex = mock(AuthenticationException.class);

        entryPoint.commence(request, response, ex);

        assertEquals(401, response.getStatus());
        assertEquals("application/json", response.getContentType());
    }

    @Test
    @DisplayName("commence should write JSON body with error status, code 401 and expected message")
    void commence_shouldWriteJsonBodyWithErrorMessage() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException ex = mock(AuthenticationException.class);

        entryPoint.commence(request, response, ex);

        String body = response.getContentAsString();
        assertTrue(body.contains("\"status\":\"error\""));
        assertTrue(body.contains("\"code\":401"));
        assertTrue(body.contains("Token inválido ou não fornecido"));
    }
}
