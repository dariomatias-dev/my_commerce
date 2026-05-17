"use server";

import { SubscriptionPlanRequest } from "@/@types/subscription-plan/subscription-plan-request";
import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
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

export async function createPlan(
  data: SubscriptionPlanRequest,
): Promise<ActionResult<SubscriptionPlanResponse>> {
  const res = await serverApi.post("/subscription-plans", data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao criar plano.",
    };
  }

  return { success: true, data: body.data as SubscriptionPlanResponse };
}

export async function updatePlan(
  id: string,
  data: Partial<SubscriptionPlanRequest>,
): Promise<ActionResult<SubscriptionPlanResponse>> {
  const res = await serverApi.patch(`/subscription-plans/${id}`, data);
  const body = await parseJson(res);

  if (!res.ok || body?.status === "error") {
    return {
      success: false,
      error: body?.message ?? "Erro ao atualizar plano.",
    };
  }

  return { success: true, data: body.data as SubscriptionPlanResponse };
}

export async function deletePlan(id: string): Promise<ActionResult> {
  const res = await serverApi.delete(`/subscription-plans/${id}`);

  if (!res.ok) {
    const body = await parseJson(res);

    return {
      success: false,
      error: body?.message ?? "Erro ao remover plano.",
    };
  }

  return { success: true };
}
