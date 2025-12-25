"use client";

import { useCallback } from "react";

import { AuthResponse } from "@/@types/auth/auth-response";
import { LoginRequest } from "@/@types/auth/login-request";
import { RecoverPasswordRequest } from "@/@types/auth/recover-password-request";
import { RefreshTokenRequest } from "@/@types/auth/refresh-token-request";
import { ResendEmailRequest } from "@/@types/auth/resend-email-request";
import { ResetPasswordRequest } from "@/@types/auth/reset-password-request";
import { SignupRequest } from "@/@types/auth/signup-request";
import { VerifyEmailRequest } from "@/@types/auth/verify-email-request";
import { apiClient } from "@/services/api-client";

export const useAuth = () => {
  const login = useCallback(
    (data: LoginRequest) => apiClient.post<AuthResponse>("/auth/login", data),
    []
  );

  const signup = useCallback(
    (data: SignupRequest) => apiClient.post<void>("/auth/signup", data),
    []
  );

  const verifyEmail = useCallback(
    (data: VerifyEmailRequest) =>
      apiClient.post<void>("/auth/verify-email", data),
    []
  );

  const resendVerificationEmail = useCallback(
    (data: ResendEmailRequest) =>
      apiClient.post<void>("/auth/resend-verification-email", data),
    []
  );

  const recoverPassword = useCallback(
    (data: RecoverPasswordRequest) =>
      apiClient.post<void>("/auth/recover-password", data),
    []
  );

  const resetPassword = useCallback(
    (data: ResetPasswordRequest) =>
      apiClient.post<void>("/auth/reset-password", data),
    []
  );

  const refreshToken = useCallback(
    (data: RefreshTokenRequest) =>
      apiClient.post<AuthResponse>("/auth/refresh-token", data),
    []
  );

  return {
    login,
    signup,
    verifyEmail,
    resendVerificationEmail,
    recoverPassword,
    resetPassword,
    refreshToken,
  };
};
