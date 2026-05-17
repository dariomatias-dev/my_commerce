import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const page = request.nextUrl.searchParams.get("page") ?? "0";
  const size = request.nextUrl.searchParams.get("size") ?? "10";
  const res = await serverApi.post(
    `/products/store/products-by-ids?page=${page}&size=${size}`,
    body,
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
