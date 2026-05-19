import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

import { UserRole } from "@/@types/user/user-response";

interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const adminGuard = async (request: NextRequest): Promise<NextResponse | null> => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    const jwtPayload = payload as unknown as JwtPayload;

    if (jwtPayload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return null;
};
