package com.dariomatias.my_commerce.enums;

import java.util.Arrays;

public enum AuditLogAction {

    LOGIN("login"),
    SIGNUP("signup"),
    VERIFY_EMAIL("verify_email"),
    RESEND_VERIFICATION("resend_verification"),
    RECOVER_PASSWORD("recover_password"),
    RESET_PASSWORD("reset_password"),
    REFRESH_TOKEN("refresh_token"),
    VALIDATE_TOKEN("validate_token");

    private final String value;

    AuditLogAction(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static AuditLogAction fromValue(String value) {
        return Arrays.stream(values())
                .filter(action -> action.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid AuditAction: " + value)
                );
    }
}
