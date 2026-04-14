import "./globals.css";
import SuperTokensProvider from "@/components/SuperTokensProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans antialiased">
        <SuperTokensProvider>{children}</SuperTokensProvider>
      </body>
    </html>
  );
}
