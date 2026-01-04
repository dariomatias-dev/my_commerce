import { NextRequest, NextResponse } from "next/server";

export const adminGuard = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
};
