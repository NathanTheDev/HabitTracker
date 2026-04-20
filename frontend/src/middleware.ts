import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Cookie-presence check is intentional: SuperTokens' edge-compatible session
  // verification is incompatible with the Next.js Edge Runtime. Real auth is
  // enforced on every request by the backend; this gate only prevents an
  // unnecessary round-trip for clearly unauthenticated users.
  const hasSession = req.cookies.has("sAccessToken");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
