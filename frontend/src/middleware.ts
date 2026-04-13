import { NextRequest, NextResponse } from "next/server";
import { withSession } from "supertokens-node/nextjs";
import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";

// Init supertokens-node for server-side session verification
SuperTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    apiKey: process.env.SUPERTOKENS_API_KEY!,
  },
  appInfo: {
    appName: "HabitTracker",
    apiDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN!,
    websiteDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN!,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
});

export async function middleware(req: NextRequest) {
  return withSession(req, async (err, session) => {
    if (err) {
      return NextResponse.next();
    }
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
