"use client";

import { useEffect, useState } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import SuperTokens from "supertokens-auth-react/ui";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";

export default function AuthPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (SuperTokens.canHandleRoute([PasswordlessPreBuiltUI])) {
      setLoaded(true);
    } else {
      redirectToAuth({ redirectBack: false });
    }
  }, []);

  if (!loaded) return null;

  return SuperTokens.getRoutingComponent([PasswordlessPreBuiltUI]);
}