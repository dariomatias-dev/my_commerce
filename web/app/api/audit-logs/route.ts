import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const params: Record<string, string> = {
    page: searchParams.get("page") ?? "0",
    size: searchParams.get("size") ?? "10",
  };

  const userId = searchParams.get("userId");
  const action = searchParams.get("action");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (userId) params.userId = userId;
  if (action) params.action = action;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const res = await serverApi.get("/audit-logs", params);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
