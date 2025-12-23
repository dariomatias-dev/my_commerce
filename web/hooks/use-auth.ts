"use client";

import { AuthResponse } from "@/@types/auth/auth-response";
import { LoginRequest } from "@/@types/auth/login-request";
import { RecoverPasswordRequest } from "@/@types/auth/recover-password-request";
import { RefreshTokenRequest } from "@/@types/auth/refresh-token-request";
import { ResendEmailRequest } from "@/@types/auth/resend-email-request";
import { ResetPasswordRequest } from "@/@types/auth/reset-password-request";
import { SignupRequest } from "@/@types/auth/signup-request";
import { VerifyEmailRequest } from "@/@types/auth/verify-email-request";
import { useApi } from "./use-api";

export const useAuth = () => {
  const apiInstance = useApi();

  const login = (data: LoginRequest) =>
    apiInstance.post<AuthResponse>("/auth/login", data);

  const signup = (data: SignupRequest) =>
    apiInstance.post<void>("/auth/signup", data);

  const verifyEmail = (data: VerifyEmailRequest) =>
    apiInstance.post<void>("/auth/verify-email", data);

  const resendVerificationEmail = (data: ResendEmailRequest) =>
    apiInstance.post<void>("/auth/resend-verification-email", data);

  const recoverPassword = (data: RecoverPasswordRequest) =>
    apiInstance.post<void>("/auth/recover-password", data);

  const resetPassword = (data: ResetPasswordRequest) =>
    apiInstance.post<void>("/auth/reset-password", data);

  const refreshToken = (data: RefreshTokenRequest) =>
    apiInstance.post<AuthResponse>("/auth/refresh-token", data);

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
