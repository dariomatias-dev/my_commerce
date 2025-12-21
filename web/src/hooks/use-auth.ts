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
  const api = useApi();

  const login = async (data: LoginRequest) => {
    return api.post<AuthResponse>("/auth/login", data);
  };

  const signup = async (data: SignupRequest) => {
    return api.post<void>("/auth/signup", data);
  };

  const verifyEmail = async (data: VerifyEmailRequest) => {
    return api.post<void>("/auth/verify-email", data);
  };

  const resendVerificationEmail = async (data: ResendEmailRequest) => {
    return api.post<void>("/auth/resend-verification-email", data);
  };

  const recoverPassword = async (data: RecoverPasswordRequest) => {
    return api.post<void>("/auth/recover-password", data);
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    return api.post<void>("/auth/reset-password", data);
  };

  const refreshToken = async (data: RefreshTokenRequest) => {
    return api.post<AuthResponse>("/auth/refresh-token", data);
  };

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
