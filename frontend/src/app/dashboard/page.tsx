"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Habit } from "@/lib/types";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompletedChart } from "@/components/dashboard/CompletedChart";
import { SimpleHabitCard, QuantityCard } from "@/components/dashboard/habit-card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = useCallback(async () => {
    try {
      const data = await api.habits.list();
      setHabits(data);
      // seed progress from today's completions
      const initial: Record<string, number> = {};
      const today = new Date().toISOString().slice(0, 10);
      for (const h of data) {
        const todayCompletion = (h.completions ?? []).find(
          (c) => c.completedAt.slice(0, 10) === today
        );
        if (!todayCompletion) continue;
        if (h.quantity > 1) {
          // use persisted partial progress, fall back to full quantity if not set
          initial[h.id] = todayCompletion.quantityProgress ?? h.quantity;
        } else {
          initial[h.id] = 1;
        }
      }
      setProgress(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  async function handleSetProgress(id: string, value: number) {
    const habit = habits.find((h) => h.id === id);

    setProgress((prev) => ({ ...prev, [id]: value }));

    if (habit && habit.quantity > 1) {
      // quantity habit — always persist so progress survives refresh
      try {
        await api.habits.complete(id, { quantityProgress: value });
      } catch {
        setProgress((prev) => ({ ...prev, [id]: Math.max(0, value - 1) }));
      }
      return;
    }

    // simple habit — only persist when done
    if (value < 1) return;

    // simple habit — persist completion when done
    try {
      await api.habits.complete(id);
    } catch {
      setProgress((prev) => ({ ...prev, [id]: Math.max(0, value - 1) }));
    }
  }

  function isComplete(h: Habit) {
    return (progress[h.id] ?? 0) >= h.quantity;
  }

  const pending = habits.filter((h) => !isComplete(h));
  const completed = habits.filter((h) => isComplete(h));

  function renderCard(h: Habit) {
    const p = progress[h.id] ?? 0;
    return h.quantity > 1 ? (
      <QuantityCard key={h.id} habit={h} progress={p} onSetProgress={handleSetProgress} />
    ) : (
      <SimpleHabitCard key={h.id} habit={h} progress={p} onSetProgress={handleSetProgress} />
    );
  }

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
              {loading
                ? "Loading…"
                : doneCount === totalCount && totalCount > 0
                ? "All habits done!"
                : `${doneCount} of ${totalCount} complete`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Keep it up</p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {loading ? "—" : totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%
          </div>
        </div>

        {/* Consistency chart */}
        <div className="mb-6">
          <CompletedChart habits={habits} />
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

        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}

        {!loading && habits.length === 0 && !error && (
          <p className="text-sm text-muted-foreground text-center py-10">
            No habits yet.{" "}
            <Link href="/habits/new" className="text-primary underline underline-offset-2">
              Add your first one.
            </Link>
          </p>
        )}

        {pending.length > 0 && (
          <div className="space-y-3 mb-6">
            {pending.map((h) => renderCard(h))}
          </div>
        )}

        {completed.length > 0 && (
          <>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Completed
            </p>
            <div className="space-y-3">
              {completed.map((h) => renderCard(h))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
