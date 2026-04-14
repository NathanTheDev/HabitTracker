"use client";

import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokens } from "@/lib/supertokens";

// Initialise once at module load — the window guard inside makes this a no-op on the server
initSuperTokens();

export default function SuperTokensProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}
