import { SuperTokensProvider } from "./compnents/auth/SuperTokensProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SuperTokensProvider>
          {children}
        </SuperTokensProvider>
      </body>
    </html>
  );
}
