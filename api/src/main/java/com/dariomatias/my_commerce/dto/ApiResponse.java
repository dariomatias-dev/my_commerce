package com.dariomatias.my_commerce.dto;

import java.util.List;

public class ApiResponse<T> {

    private String status;
    private int code;
    private String message;
    private T data;
    private List<FieldError> errors;

    public ApiResponse(String status, int code, String message, T data, List<FieldError> errors) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", 200, message, data, null);
    }

    public static <T> ApiResponse<T> success(int code, String message, T data) {
        return new ApiResponse<>("success", code, message, data, null);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>("error", code, message, null, null);
    }

    public static <T> ApiResponse<T> error(int code, String message, List<FieldError> errors) {
        return new ApiResponse<>("error", code, message, null, errors);
    }

    public String getStatus() {
        return status;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public List<FieldError> getErrors() {
        return errors;
    }

    public boolean isSuccess() {
        return "success".equalsIgnoreCase(this.status);
    }
}
