"use server";

import { StoreRequest } from "@/@types/store/store-request";
import { StoreResponse } from "@/@types/store/store-response";
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

export async function createStore(
  data: StoreRequest,
  logo: File,
  banner: File,
): Promise<ActionResult<StoreResponse>> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  formData.append("logo", logo);
  formData.append("banner", banner);

  const res = await serverApi.postFormData("/stores", formData);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return { success: false, error: body?.message ?? "Erro ao criar loja." };
  }

  return { success: true, data: body.data as StoreResponse };
}

export async function updateStore(
  id: string,
  data?: Partial<StoreRequest>,
  logo?: File,
  banner?: File,
): Promise<ActionResult<StoreResponse>> {
  const formData = new FormData();
  if (data) {
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
  }
  if (logo) formData.append("logo", logo);
  if (banner) formData.append("banner", banner);

  const res = await serverApi.patchFormData(`/stores/${id}`, formData);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar loja.",
    };
  }

  return { success: true, data: body.data as StoreResponse };
}

export async function deleteStore(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/stores/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);
    return { success: false, error: body?.message ?? "Erro ao remover loja." };
  }

  return { success: true };
}
