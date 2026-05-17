import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(_: NextRequest, { params }: { params: Promise<{ store: string }> }) {
  const { store } = await params;
  const res = await serverApi.get(`/products/store/${store}/stats/active-products`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
