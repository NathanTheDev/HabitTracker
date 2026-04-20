"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSessionContext, signOut } from "supertokens-auth-react/recipe/session";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";

function inferDisplayName(email: string): string {
  const local = email.split("@")[0];
  return local
    .split(/[._\-+]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const session = useSessionContext();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [draft, setDraft] = useState("");
  const [memberSince, setMemberSince] = useState<string | null>(null);

  const userId = !session.loading && session.doesSessionExist ? session.userId : null;

  useEffect(() => {
    if (session.loading || !session.doesSessionExist) return;
    fetch("/api/user/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.email && !displayName) {
          setDisplayName(inferDisplayName(data.email));
        }
        if (data.timeJoined) {
          setMemberSince(
            new Date(data.timeJoined).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          );
        }
      })
      .catch(() => {});
  }, [session.loading, session.doesSessionExist]);

  function handleEdit() {
    setDraft(displayName);
    setEditing(true);
  }

  function handleSave() {
    setDisplayName(draft.trim());
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  async function handleLogout() {
    await signOut();
    router.push("/auth");
  }

  const initials = displayName ? getInitials(displayName) : "?";

  return (
    <main className="min-h-screen bg-background px-4 py-8 max-w-lg mx-auto">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </Link>

      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold text-foreground">
          {displayName || "My Profile"}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Account Details</CardTitle>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={handleEdit} className="text-muted-foreground -mr-2">
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Display Name
            </p>
            {editing ? (
              <Input
                autoFocus
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Your name"
                className="h-auto rounded-lg py-1.5"
              />
            ) : (
              <p className="text-sm text-foreground">{displayName || "—"}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              User ID
            </p>
            <p className="text-sm text-foreground font-mono">{userId ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Member since
            </p>
            <p className="text-sm text-foreground">{memberSince ?? "—"}</p>
          </div>

          {editing && (
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        className="w-full mt-4"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </main>
  );
}
