"use client";

import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokens } from "@/lib/supertokens";

initSuperTokens();

export default function SuperTokensProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}
