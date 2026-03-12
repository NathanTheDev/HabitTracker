"use client";

import { frontendConfig } from "@/app/config/supertokens";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";

if (typeof window !== "undefined") {
  SuperTokens.init(frontendConfig());
}

export function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}
