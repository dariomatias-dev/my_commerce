package com.dariomatias.my_commerce.exception;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.FieldError;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        ApiResponse<Void> response = ApiResponse.error(403, "Acesso negado: você não possui permissão para acessar este recurso");
        return ResponseEntity.status(403).body(response);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ApiResponse<String> handleResponseStatusException(ResponseStatusException ex) {
        return ApiResponse.error(ex.getStatusCode().value(), ex.getReason());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<?> handleValidationException(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new FieldError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());

        return ApiResponse.error(400, "Erro de validação", fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ApiResponse<String> handleJsonParseError(HttpMessageNotReadableException ex) {
        String message = ex.getMostSpecificCause().getMessage();

        if (message != null && message.contains("not one of the values accepted for Enum class")) {
            Pattern pattern = Pattern.compile("Enum class: \\[(.*?)\\]");
            Matcher matcher = pattern.matcher(message);

            if (matcher.find()) {
                String allowedValues = matcher.group(1);
                return ApiResponse.error(400, "Valor inválido para um método de pagamento. Valores permitidos: " + allowedValues);
            }

            return ApiResponse.error(400, "Valor inválido para um campo enum.");
        }

        return ApiResponse.error(400, "Erro ao interpretar o corpo da requisição: verifique os dados enviados.");
    }

    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<String> handleRuntimeException(RuntimeException ex) {
        return ApiResponse.error(400, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<String> handleException(Exception ex) {
        return ApiResponse.error(500, "Ocorreu um erro interno: " + ex.getMessage());
    }
}
