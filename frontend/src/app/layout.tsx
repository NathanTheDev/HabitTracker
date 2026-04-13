"use client";

import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSuperTokens } from "@/lib/supertokens";

initSuperTokens();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SuperTokensWrapper>{children}</SuperTokensWrapper>
      </body>
    </html>
  );
}
