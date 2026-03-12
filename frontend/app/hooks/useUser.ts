"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useEffect, useState } from "react";

interface User {
  id: string;
  supertokens_id: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useUser(): UseUserResult {
  const session = useSessionContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (session.loading) return;
    if (!session.doesSessionExist) {
      setIsLoading(false);
      return;
    }
    if (hasFetched) return;

    setHasFetched(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(({ user }) => setUser(user))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [session, hasFetched]);

  return {
    user,
    isLoading: session.loading || isLoading,
    error,
    isAuthenticated: !session.loading && session.doesSessionExist,
  };
}