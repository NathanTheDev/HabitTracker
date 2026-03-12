"use client";

import { signOut } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { ProtectedRoute } from "../compnents/ProtectedRoute";

interface Habit {
  id: string;
  creator_id: string;
  habit_name: string;
  completed: boolean;
  created_at: string;
}

function DashboardContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch habits");
        return res.json();
      })
      .then(({ habits }) => setHabits(habits))
      .catch((err) => setError(err.message))
      .finally(() => setHabitsLoading(false));
  }, [user]);

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habit_name: newHabitName }),
    });

    if (!res.ok) {
      setError("Failed to create habit");
      return;
    }

    const { habit } = await res.json();
    setHabits((prev) => [...prev, habit]);
    setNewHabitName("");
  };

  const handleToggleComplete = async (habit: Habit) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/habits/${habit.id}/complete`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !habit.completed }),
      }
    );

    if (!res.ok) {
      setError("Failed to update habit");
      return;
    }

    const { habit: updated } = await res.json();
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email ?? user?.phone}</p>
      <button onClick={handleSignOut}>Sign out</button>

      <hr />

      <h2>My Habits</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="New habit name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
        />
        <button onClick={handleCreateHabit}>Add Habit</button>
      </div>

      {habitsLoading ? (
        <p>Loading habits...</p>
      ) : habits.length === 0 ? (
        <p>No habits yet. Add one above!</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>
              <span style={{ textDecoration: habit.completed ? "line-through" : "none" }}>
                {habit.habit_name}
              </span>
              <button onClick={() => handleToggleComplete(habit)}>
                {habit.completed ? "Uncomplete" : "Complete"}
              </button>
            </li>
          ))}
        </ul>
      )}
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