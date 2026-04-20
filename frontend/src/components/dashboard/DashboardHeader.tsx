"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getInitials(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(/[._\-+]/);
  return parts
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export function DashboardHeader() {
  const session = useSessionContext();
  const [initials, setInitials] = useState("?");

  useEffect(() => {
    if (session.loading || !session.doesSessionExist) return;
    fetch("/api/user/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.email) setInitials(getInitials(data.email));
      })
      .catch(() => {});
  }, [session.loading, session.doesSessionExist]);

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Good morning</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <Link href="/profile">
        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
