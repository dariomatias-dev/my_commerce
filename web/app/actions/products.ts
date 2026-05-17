"use server";

import { ProductRequest } from "@/@types/product/product-request";
import { ProductResponse } from "@/@types/product/product-response";
import { serverApi } from "@/lib/server-api";

type ActionSuccess<T = void> = T extends void ? { success: true } : { success: true; data: T };

type ActionFailure = { success: false; error: string };

type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function createProduct(
  data: ProductRequest,
  images: File[],
): Promise<ActionResult<ProductResponse>> {
  const formData = new FormData();

  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

  images.forEach((img) => formData.append("images", img));

  const res = await serverApi.postFormData("/products", formData);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return { success: false, error: body?.message ?? "Erro ao criar produto." };
  }

  return { success: true, data: body.data as ProductResponse };
}

export async function updateProduct(
  id: string,
  data?: Partial<ProductRequest>,
  newImages?: File[],
  removedImageNames?: string[],
): Promise<ActionResult<ProductResponse>> {
  const formData = new FormData();

  if (data || removedImageNames?.length) {
    formData.append(
      "data",
      new Blob([JSON.stringify({ ...data, removedImageNames })], {
        type: "application/json",
      }),
    );
  }

  newImages?.forEach((img) => formData.append("images", img));

  const res = await serverApi.patchFormData(`/products/${id}`, formData);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar produto.",
    };
  }

  return { success: true, data: body.data as ProductResponse };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/products/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao remover produto.",
    };
  }

  return { success: true };
}
