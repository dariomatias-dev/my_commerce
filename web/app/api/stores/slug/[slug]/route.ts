import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await serverApi.get(`/stores/slug/${slug}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
