"use server";

import { CategoryRequest } from "@/@types/category/category-request";
import { CategoryResponse } from "@/@types/category/category-response";
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

export async function createCategory(
  data: CategoryRequest,
): Promise<ActionResult<CategoryResponse>> {
  const res = await serverApi.post("/categories", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao criar categoria.",
    };
  }

  return { success: true, data: body.data as CategoryResponse };
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryRequest>,
): Promise<ActionResult<CategoryResponse>> {
  const res = await serverApi.patch(`/categories/${id}`, data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar categoria.",
    };
  }

  return { success: true, data: body.data as CategoryResponse };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/categories/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao excluir categoria.",
    };
  }

  return { success: true };
}
