import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const res = await serverApi.get("/stores/me", params);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
