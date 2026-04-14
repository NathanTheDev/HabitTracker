"use client";

import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import { HabitCard } from "./HabitCard";

interface Props {
  habit: Habit;
  progress: number;
  onSetProgress: (id: string, value: number) => void;
}

export function SimpleHabitCard({ habit, progress, onSetProgress }: Props) {
  const done = progress >= 1;

  return (
    <HabitCard
      name={habit.name}
      emoji={habit.emoji}
      done={done}
      role="button"
      tabIndex={0}
      onClick={() => onSetProgress(habit.id, done ? 0 : 1)}
      onKeyDown={(e) => e.key === "Enter" && onSetProgress(habit.id, done ? 0 : 1)}
      className={cn(
        "border text-left transition-all",
        done
          ? "border-primary/30 bg-primary/10 cursor-pointer"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-pointer"
      )}
    />
  );
}
