package com.dariomatias.my_commerce.dto.refresh_token;

public class RefreshTokenResponse {
    private String accessToken;

    private String refreshToken;

    public RefreshTokenResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String getAccessToken() { return accessToken; }

    public String getRefreshToken() { return refreshToken; }
}
