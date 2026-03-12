"use client";

import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import SessionReact from "supertokens-auth-react/recipe/session";

function initSuperTokens() {
  SuperTokens.init({
    appInfo: {
      appName: "HabitTracker",
      apiDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN!,
      websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN!,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      PasswordlessReact.init({
        contactMethod: "EMAIL",
      }),
      SessionReact.init({
        tokenTransferMethod: "cookie",
      }),
    ],
  });
}

export function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  initSuperTokens();
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}