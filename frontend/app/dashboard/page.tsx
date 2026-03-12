"use client";

import { signOut } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../compnents/ProtectedRoute";
import { useUser } from "../hooks/useUser";

function DashboardContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email ?? user?.phone}</p>
      <p>Account created: {user?.created_at}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}