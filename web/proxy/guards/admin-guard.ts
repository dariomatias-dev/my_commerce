import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "@/@types/user/user-response";

interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
};

export const adminGuard = (request: NextRequest): NextResponse | null => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let payload: JwtPayload;

  try {
    payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    ) as JwtPayload;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
};
