import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await serverApi.get(`/subscriptions/${id}`);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
