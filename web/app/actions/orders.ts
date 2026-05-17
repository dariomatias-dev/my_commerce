"use server";

import { OrderRequest } from "@/@types/order/order-request";
import { OrderResponse } from "@/@types/order/order-response";
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

export async function createOrder(
  data: OrderRequest,
): Promise<ActionResult<OrderResponse>> {
  const res = await serverApi.post("/orders", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao criar pedido.",
    };
  }

  return { success: true, data: body.data as OrderResponse };
}

export async function deleteOrder(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/orders/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao remover pedido.",
    };
  }

  return { success: true };
}
