"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "./hooks/useUser";

export default function Home() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Welcome to HabitTracker</h1>
      <button onClick={() => router.push("/auth")}>Sign in</button>
    </main>
  );
}