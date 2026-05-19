import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

export const dashboardGuard = async (request: NextRequest): Promise<NextResponse | null> => {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/login", request.url));

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return null;
};
