import { NextRequest, NextResponse } from "next/server";

export const dashboardGuard = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const parts = token.split(".");
  if (parts.length !== 3) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    JSON.parse(Buffer.from(parts[1], "base64").toString());
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return null;
};
