import { DynamicSuperTokens } from "./compnents/auth/DynamicSupertokens";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DynamicSuperTokens>
          {children}
        </DynamicSuperTokens>
      </body>
    </html>
  );
}