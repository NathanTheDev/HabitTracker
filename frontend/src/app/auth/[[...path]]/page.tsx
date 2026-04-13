"use client";

import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { notFound } from "next/navigation";

export default function AuthPage() {
  if (canHandleRoute([EmailPasswordPreBuiltUI])) {
    return getRoutingComponent([EmailPasswordPreBuiltUI]);
  }
  notFound();
}
