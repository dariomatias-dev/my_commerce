package com.dariomatias.my_commerce.exception;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.controller.stub.StubExceptionController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(StubExceptionController.class)
@DisplayName("GlobalExceptionHandler")
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("AccessDeniedException should return 403 with access denied message")
    void handleAccessDeniedException_shouldReturn403() throws Exception {
        mockMvc.perform(get("/stub/access-denied"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.message").value("Acesso negado: você não possui permissão para acessar este recurso"));
    }

    @Test
    @DisplayName("ResponseStatusException should return configured status and message")
    void handleResponseStatusException_shouldReturnConfiguredStatusAndMessage() throws Exception {
        mockMvc.perform(get("/stub/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("Resource not found"));
    }

    @Test
    @DisplayName("MethodArgumentNotValidException should return 400 with field error list")
    void handleValidationException_shouldReturn400WithFieldErrors() throws Exception {
        mockMvc.perform(post("/stub/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("Erro de validação"))
                .andExpect(jsonPath("$.errors[0].field").value("name"));
    }

    @Test
    @DisplayName("HttpMessageNotReadableException with invalid enum should return 400 with allowed values")
    void handleJsonParseError_withInvalidEnum_shouldReturn400WithAllowedValues() throws Exception {
        mockMvc.perform(post("/stub/enum")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paymentMethod\": \"INVALIDO\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value(containsString("Valores permitidos:")));
    }

    @Test
    @DisplayName("HttpMessageNotReadableException with malformed JSON should return 400 with generic message")
    void handleJsonParseError_withMalformedJson_shouldReturn400() throws Exception {
        mockMvc.perform(post("/stub/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid json}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("Erro ao interpretar o corpo da requisição: verifique os dados enviados."));
    }

    @Test
    @DisplayName("RuntimeException should return 400 with request error message")
    void handleRuntimeException_shouldReturn400() throws Exception {
        mockMvc.perform(get("/stub/runtime"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("Erro na requisição"));
    }

    @Test
    @DisplayName("Generic Exception should return 500 with internal error message")
    void handleException_shouldReturn500() throws Exception {
        mockMvc.perform(get("/stub/server-error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("Erro interno do servidor"));
    }
}
