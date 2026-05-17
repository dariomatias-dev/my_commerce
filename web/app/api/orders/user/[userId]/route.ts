import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const { searchParams } = req.nextUrl;
  const res = await serverApi.get(`/orders/user/${userId}`, {
    page: searchParams.get("page") ?? "0",
    size: searchParams.get("size") ?? "10",
  });
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
