import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET() {
  const res = await serverApi.get("/addresses");
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
