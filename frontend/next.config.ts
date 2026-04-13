import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy /auth/* to the backend so SuperTokens session cookies are
    // issued on the same origin (localhost:3000) — avoids SameSite issues in dev
    return [
      {
        source: "/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
