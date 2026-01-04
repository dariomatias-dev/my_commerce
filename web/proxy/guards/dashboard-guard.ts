import { NextRequest, NextResponse } from "next/server";

export const dashboardGuard = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  if (payload.role === "USER") {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return null;
};
