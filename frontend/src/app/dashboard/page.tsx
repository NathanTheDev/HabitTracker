"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Habit } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConsistencyChart } from "@/components/dashboard/ConsistencyChart";
import { SimpleHabitCard, QuantityCard } from "@/components/dashboard/habit-card";
import { Button } from "@/components/ui/button";

const today = new Date().toISOString();

// Placeholder data — no auth/API in this phase
const PLACEHOLDER_HABITS: Habit[] = [
  {
    id: "1",
    userId: "placeholder",
    name: "Morning run",
    emoji: "🏃",
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [{ id: "c1", habitId: "1", completedAt: today, createdAt: today }],
  },
  {
    id: "2",
    userId: "placeholder",
    name: "Read",
    emoji: "📚",
    quantity: 20,
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [],
  },
  {
    id: "3",
    userId: "placeholder",
    name: "Meditate",
    emoji: "🧘",
    quantity: 10,
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [],
  },
  {
    id: "4",
    userId: "placeholder",
    name: "Drink water",
    emoji: "💧",
    quantity: 8,
    frequency: "DAILY",
    createdAt: today,
    updatedAt: today,
    completions: [],
  },
];

export default function DashboardPage() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  function handleSetProgress(id: string, value: number) {
    setProgress((prev) => ({ ...prev, [id]: value }));
  }

  function isCompleted(habit: Habit) {
    return (progress[habit.id] ?? 0) >= (habit.quantity ?? 1);
  }

  const pending = PLACEHOLDER_HABITS.filter((h) => !isCompleted(h));
  const completed = PLACEHOLDER_HABITS.filter((h) => isCompleted(h));
  const doneCount = completed.length;
  const totalCount = PLACEHOLDER_HABITS.length;

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
          <ConsistencyChart habits={PLACEHOLDER_HABITS} />
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
            {pending.map((h) =>
              h.quantity != null
                ? <QuantityCard key={h.id} habit={h} progress={progress[h.id] ?? 0} onSetProgress={handleSetProgress} />
                : <SimpleHabitCard key={h.id} habit={h} progress={progress[h.id] ?? 0} onSetProgress={handleSetProgress} />
            )}
          </div>
        )}

        {completed.length > 0 && (
          <>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Completed
            </p>
            <div className="space-y-3">
              {completed.map((h) =>
              h.quantity != null
                ? <QuantityCard key={h.id} habit={h} progress={progress[h.id] ?? 0} onSetProgress={handleSetProgress} />
                : <SimpleHabitCard key={h.id} habit={h} progress={progress[h.id] ?? 0} onSetProgress={handleSetProgress} />
            )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
