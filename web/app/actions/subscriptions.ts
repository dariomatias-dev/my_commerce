"use server";

import { SubscriptionRequest } from "@/@types/subscription/subscription-request";
import { SubscriptionResponse } from "@/@types/subscription/subscription-response";
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

export async function createSubscription(
  data: SubscriptionRequest,
): Promise<ActionResult<SubscriptionResponse>> {
  const res = await serverApi.post("/subscriptions", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao criar assinatura.",
    };
  }

  return { success: true, data: body.data as SubscriptionResponse };
}

export async function changeSubscriptionPlan(
  data: SubscriptionRequest,
): Promise<ActionResult<SubscriptionResponse>> {
  const res = await serverApi.patch("/subscriptions/change-plan", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao alterar plano.",
    };
  }

  return { success: true, data: body.data as SubscriptionResponse };
}

export async function cancelSubscription(): Promise<ActionResult> {
  const res = await serverApi.patch("/subscriptions/cancel");

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao cancelar assinatura.",
    };
  }

  return { success: true };
}
