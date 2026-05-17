import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const params: Record<string, string> = {
    page: searchParams.get("page") ?? "0",
    size: searchParams.get("size") ?? "10",
  };

  const storeId = searchParams.get("storeId");
  const name = searchParams.get("name");

  if (storeId) params.storeId = storeId;
  if (name) params.name = name;

  const res = await serverApi.get("/categories", params);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
