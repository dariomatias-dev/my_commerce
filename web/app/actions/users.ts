"use server";

import { PasswordUpdateRequest } from "@/@types/user/password-update-request";
import { UserRequest } from "@/@types/user/user-request";
import { UserResponse } from "@/@types/user/user-response";
import { serverApi } from "@/lib/server-api";

type ActionSuccess<T = void> = T extends void
  ? { success: true }
  : { success: true; data: T };

type ActionFailure = { success: false; error: string };

type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateUser(
  id: string,
  data: Partial<UserRequest>,
): Promise<ActionResult<UserRequest>> {
  const res = await serverApi.patch(`/users/${id}`, data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar usuário.",
    };
  }

  return { success: true, data: body.data as UserRequest };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/users/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao remover usuário.",
    };
  }

  return { success: true };
}

export async function updateMe(
  data: Partial<UserRequest>,
): Promise<ActionResult<UserResponse>> {
  const res = await serverApi.patch("/users/me", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar perfil.",
    };
  }

  return { success: true, data: body.data as UserResponse };
}

export async function changePassword(
  data: PasswordUpdateRequest,
): Promise<ActionResult> {
  const res = await serverApi.post("/users/me/change-password", data);

  if (!res.ok) {
    const body = await parseJson(res);

    return { success: false, error: body?.message ?? "Erro ao alterar senha." };
  }

  return { success: true };
}

export async function deleteMe(): Promise<ActionResult> {
  const res = await serverApi.delete("/users/me");

  if (!res.ok) {
    const body = await parseJson(res);

    return { success: false, error: body?.message ?? "Erro ao excluir conta." };
  }

  return { success: true };
}
