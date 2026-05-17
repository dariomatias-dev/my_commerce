import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> },
) {
  const { addressId } = await params;
  const res = await serverApi.get(`/freight/${addressId}`);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
