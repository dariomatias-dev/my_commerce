import { NextRequest, NextResponse } from "next/server";

import { dashboardGuard } from "./middleware/guards/dashboard-guard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const response = dashboardGuard(request);
    if (response) return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
