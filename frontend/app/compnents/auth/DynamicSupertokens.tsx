"use client";

import dynamic from "next/dynamic";

const SuperTokensProvider = dynamic(
  () => import("./SuperTokensProvider").then(mod => mod.SuperTokensProvider),
  { ssr: false }
);

export function DynamicSuperTokens({ children }: { children: React.ReactNode }) {
  return <SuperTokensProvider>{children}</SuperTokensProvider>;
}