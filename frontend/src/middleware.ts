import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // sAccessToken is the cookie SuperTokens Node SDK sets for the access token
  const hasSession = req.cookies.has("sAccessToken");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
