import { NextRequest, NextResponse } from "next/server";

import { adminGuard } from "./proxy/guards/admin-guard";
import { dashboardGuard } from "./proxy/guards/dashboard-guard";

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const response = await dashboardGuard(request);
    if (response) return response;
  }

  if (pathname.startsWith("/admin")) {
    const response = await adminGuard(request);
    if (response) return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
