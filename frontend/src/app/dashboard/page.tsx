"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Habit } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConsistencyChart } from "@/components/dashboard/ConsistencyChart";
import { HabitCard } from "@/components/dashboard/HabitCard";
import { Button } from "@/components/ui/button";

const today = new Date().toISOString();

// Placeholder data — no auth/API in this phase
const PLACEHOLDER_HABITS: Habit[] = [
  {
    id: "1",
    userId: "placeholder",
    name: "Morning run",
    description: "30 min outside",
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [{ id: "c1", habitId: "1", completedAt: today, createdAt: today }],
  },
  {
    id: "2",
    userId: "placeholder",
    name: "Read",
    description: "At least 20 pages",
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [],
  },
  {
    id: "3",
    userId: "placeholder",
    name: "Meditate",
    description: "10 min session",
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [],
  },
  {
    id: "4",
    userId: "placeholder",
    name: "Drink water",
    description: "8 glasses",
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [],
  },
];

function isTodayCompleted(habit: Habit): boolean {
  if (!habit.completions?.length) return false;
  const todayStr = new Date().toDateString();
  return habit.completions.some(
    (c) => new Date(c.completedAt).toDateString() === todayStr
  );
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>(PLACEHOLDER_HABITS);

  function handleComplete(id: string) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completions: [
                ...(h.completions ?? []),
                {
                  id: `c-${Date.now()}`,
                  habitId: id,
                  completedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : h
      )
    );
  }

  const pending = habits.filter((h) => !isTodayCompleted(h));
  const completed = habits.filter((h) => isTodayCompleted(h));
  const doneCount = completed.length;
  const totalCount = habits.length;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <DashboardHeader />

        {/* Progress summary */}
        <div className="mb-6 rounded-[16px] bg-primary/10 border border-primary/20 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {doneCount === totalCount
                ? "All habits done!"
                : `${doneCount} of ${totalCount} complete`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Keep it up</p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%
          </div>
        </div>

        {/* Consistency chart */}
        <div className="mb-6">
          <ConsistencyChart habits={habits} />
        </div>

        {/* Today's habits */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Today</h2>
          <Link href="/habits/new">
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add habit
            </Button>
          </Link>
        </div>

        {pending.length > 0 && (
          <div className="space-y-3 mb-6">
            {pending.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                completedToday={false}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}

        {completed.length > 0 && (
          <>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Completed
            </p>
            <div className="space-y-3">
              {completed.map((h) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  completedToday={true}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
