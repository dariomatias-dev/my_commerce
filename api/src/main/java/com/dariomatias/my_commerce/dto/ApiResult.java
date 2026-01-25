package com.dariomatias.my_commerce.dto;

import java.util.List;

public record ApiResult<T>(String status, int code, String message, T data, List<FieldError> errors) {

    public static <T> ApiResult<T> success(String message, T data) {
        return new ApiResult<>("success", 200, message, data, null);
    }

    public static <T> ApiResult<T> success(int code, String message, T data) {
        return new ApiResult<>("success", code, message, data, null);
    }

    public static <T> ApiResult<T> error(int code, String message) {
        return new ApiResult<>("error", code, message, null, null);
    }

    public static <T> ApiResult<T> error(int code, String message, List<FieldError> errors) {
        return new ApiResult<>("error", code, message, null, errors);
    }

    public boolean isSuccess() {
        return "success".equalsIgnoreCase(this.status);
    }
}
