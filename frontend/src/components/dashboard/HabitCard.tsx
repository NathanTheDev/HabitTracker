"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";

interface Props {
  habit: Habit;
  completedToday: boolean;
  onComplete: (id: string) => Promise<void>;
}

export function HabitCard({ habit, completedToday, onComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(completedToday);

  async function handleClick() {
    if (done || loading) return;
    setLoading(true);
    try {
      await onComplete(habit.id);
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={done || loading}
      className={cn(
        "w-full flex items-center gap-4 rounded-[16px] border px-5 py-4 text-left transition-all",
        done
          ? "border-primary/30 bg-primary/10 cursor-default"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-pointer",
        loading && "opacity-60"
      )}
    >
      <span className="shrink-0">
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </span>
      <span className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium text-sm truncate",
            done ? "text-primary line-through" : "text-foreground"
          )}
        >
          {habit.name}
        </p>
        {habit.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {habit.description}
          </p>
        )}
      </span>
      <span
        className={cn(
          "shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full",
          habit.frequency === "DAILY"
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {habit.frequency === "DAILY" ? "Daily" : "Weekly"}
      </span>
    </button>
  );
}
