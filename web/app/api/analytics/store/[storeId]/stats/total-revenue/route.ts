import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  const res = await serverApi.get(`/analytics/store/${storeId}/stats/total-revenue`);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
