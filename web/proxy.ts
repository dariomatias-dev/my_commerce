import { NextRequest, NextResponse } from "next/server";

import { dashboardGuard } from "./proxy/guards/dashboard-guard";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const response = dashboardGuard(request);
    if (response) return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*"],
};
