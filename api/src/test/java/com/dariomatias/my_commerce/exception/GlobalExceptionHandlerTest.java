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
    @DisplayName("AccessDeniedException deve retornar 403 com mensagem de acesso negado")
    void handleAccessDeniedException_deveRetornar403() throws Exception {
        mockMvc.perform(get("/stub/access-denied"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.message").value("Acesso negado: você não possui permissão para acessar este recurso"));
    }

    @Test
    @DisplayName("ResponseStatusException deve retornar o status e mensagem configurados")
    void handleResponseStatusException_deveRetornarStatusEMensagemConfigurados() throws Exception {
        mockMvc.perform(get("/stub/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("Recurso não encontrado"));
    }

    @Test
    @DisplayName("MethodArgumentNotValidException deve retornar 400 com lista de erros de campo")
    void handleValidationException_deveRetornar400ComErrosDeCampo() throws Exception {
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
    @DisplayName("HttpMessageNotReadableException com enum inválido deve retornar 400 com valores permitidos")
    void handleJsonParseError_comEnumInvalido_deveRetornar400ComValoresPermitidos() throws Exception {
        mockMvc.perform(post("/stub/enum")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paymentMethod\": \"INVALIDO\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value(containsString("Valores permitidos:")));
    }

    @Test
    @DisplayName("HttpMessageNotReadableException com JSON malformado deve retornar 400 com mensagem genérica")
    void handleJsonParseError_comJsonMalformado_deveRetornar400() throws Exception {
        mockMvc.perform(post("/stub/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid json}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("Erro ao interpretar o corpo da requisição: verifique os dados enviados."));
    }

    @Test
    @DisplayName("RuntimeException deve retornar 400 com mensagem de erro na requisição")
    void handleRuntimeException_deveRetornar400() throws Exception {
        mockMvc.perform(get("/stub/runtime"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("Erro na requisição"));
    }

    @Test
    @DisplayName("Exception genérica deve retornar 500 com mensagem de erro interno")
    void handleException_deveRetornar500() throws Exception {
        mockMvc.perform(get("/stub/server-error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("Erro interno do servidor"));
    }
}
