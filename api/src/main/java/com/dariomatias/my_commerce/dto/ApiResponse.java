package com.dariomatias.my_commerce.dto;

import java.util.List;

public record ApiResponse<T>(String status, int code, String message, T data, List<FieldError> errors) {

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

    public boolean isSuccess() {
        return "success".equalsIgnoreCase(this.status);
    }
}
