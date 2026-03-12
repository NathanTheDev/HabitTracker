"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSessionContext();

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (!session.doesSessionExist) {
    redirectToAuth({ redirectBack: true });
    return null;
  }

  if (!session.doesSessionExist) {
    return null;
  }

  return <>{children}</>;
}
