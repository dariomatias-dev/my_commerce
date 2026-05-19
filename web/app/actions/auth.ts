"use server";

import { cookies } from "next/headers";

import { FieldError } from "@/@types/api";
import { AuthResponse } from "@/@types/auth/auth-response";
import { LoginRequest } from "@/@types/auth/login-request";
import { RecoverPasswordRequest } from "@/@types/auth/recover-password-request";
import { ResetPasswordRequest } from "@/@types/auth/reset-password-request";
import { SignupRequest } from "@/@types/auth/signup-request";
import { VerifyEmailRequest } from "@/@types/auth/verify-email-request";
import { ResendEmailRequest } from "@/@types/auth/resend-email-request";
import { serverApi } from "@/lib/server-api";

type ActionSuccess = { success: true };
type ActionFailure = { success: false; error: string; errors?: FieldError[] };
type ActionResult = ActionSuccess | ActionFailure;

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function setAuthCookies(authData: AuthResponse) {
  const cookieStore = await cookies();

  cookieStore.set("token", authData.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  cookieStore.set("refreshToken", authData.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  cookieStore.set("isLoggedIn", "1", {
    httpOnly: false,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("refreshToken");
  cookieStore.delete("isLoggedIn");
}

export async function login(data: LoginRequest): Promise<ActionResult> {
  const res = await serverApi.post("/auth/login", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao fazer login.",
      errors: body?.errors,
    };
  }

  await setAuthCookies(body.data as AuthResponse);

  return { success: true };
}

export async function signup(data: SignupRequest): Promise<ActionResult> {
  const res = await serverApi.post("/auth/signup", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao criar conta.",
      errors: body?.errors,
    };
  }

  return { success: true };
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<ActionResult> {
  const res = await serverApi.post("/auth/verify-email", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao verificar e-mail.",
      errors: body?.errors,
    };
  }

  return { success: true };
}

export async function resendVerificationEmail(data: ResendEmailRequest): Promise<ActionResult> {
  const res = await serverApi.post("/auth/resend-verification-email", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao reenviar e-mail.",
      errors: body?.errors,
    };
  }

  return { success: true };
}

export async function recoverPassword(data: RecoverPasswordRequest): Promise<ActionResult> {
  const res = await serverApi.post("/auth/recover-password", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao recuperar senha.",
      errors: body?.errors,
    };
  }

  return { success: true };
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ActionResult> {
  const res = await serverApi.post("/auth/reset-password", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao redefinir senha.",
      errors: body?.errors,
    };
  }

  return { success: true };
}

export async function refreshTokenAction(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return { success: false, error: "Sessão expirada." };
  }

  const res = await serverApi.post("/auth/refresh-token", { refreshToken });
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao renovar sessão.",
      errors: body?.errors,
    };
  }

  await setAuthCookies(body.data as AuthResponse);

  return { success: true };
}
