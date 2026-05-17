"use server";

import { UserAddressRequest } from "@/@types/address/user-address-request";
import { UserAddressResponse } from "@/@types/address/user-address-response";
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

export async function createAddress(
  data: UserAddressRequest,
): Promise<ActionResult<UserAddressResponse>> {
  const res = await serverApi.post("/addresses", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao cadastrar endereço.",
    };
  }

  return { success: true, data: body.data as UserAddressResponse };
}

export async function updateAddress(
  id: string,
  data: UserAddressRequest,
): Promise<ActionResult<UserAddressResponse>> {
  const res = await serverApi.put(`/addresses/${id}`, data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar endereço.",
    };
  }

  return { success: true, data: body.data as UserAddressResponse };
}

export async function deleteAddress(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/addresses/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao remover endereço.",
    };
  }

  return { success: true };
}
