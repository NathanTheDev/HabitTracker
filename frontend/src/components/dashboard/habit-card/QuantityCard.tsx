"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";
import { HabitCard } from "./HabitCard";

interface Props {
  habit: Habit;
  progress: number;
  onSetProgress: (id: string, value: number) => void;
}

export function QuantityCard({ habit, progress, onSetProgress }: Props) {
  const target = habit.quantity;
  const cardRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startProgress: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [liveProgress, setLiveProgress] = useState(progress);
  const done = liveProgress >= target;
  const [editingCount, setEditingCount] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDragging) setLiveProgress(progress);
  }, [progress, isDragging]);

  useEffect(() => {
    if (editingCount) inputRef.current?.select();
  }, [editingCount]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (editingCount) return;
    dragState.current = { startX: e.clientX, startProgress: liveProgress };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const deltaX = e.clientX - dragState.current.startX;
    if (!isDragging && Math.abs(deltaX) < 6) return;
    if (!isDragging) setIsDragging(true);

    const cardWidth = cardRef.current?.offsetWidth ?? 300;
    const raw = dragState.current.startProgress + Math.round((deltaX / cardWidth) * target);
    setLiveProgress(Math.max(0, Math.min(target, raw)));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const wasDrag = isDragging;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    dragState.current = null;
    setIsDragging(false);
    if (wasDrag) onSetProgress(habit.id, liveProgress);
  }

  function openEdit() {
    if (isDragging) return;
    setInputValue(String(liveProgress));
    setEditingCount(true);
  }

  function commitEdit() {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) onSetProgress(habit.id, Math.max(0, Math.min(target, parsed)));
    setEditingCount(false);
  }

  function handleInputKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditingCount(false);
  }

  const pct = Math.min((liveProgress / target) * 100, 100);

  const innerBg = isDragging
    ? `linear-gradient(to right, color-mix(in srgb, var(--color-primary) 10%, transparent) ${pct}%, var(--color-card) ${pct}%)`
    : `linear-gradient(var(--color-card), var(--color-card))`;

  const progressBorderGradient = `${innerBg} padding-box, linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%) border-box`;

  return (
    <HabitCard
      ref={cardRef}
      name={habit.name}
      emoji={habit.emoji}
      done={done}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "select-none",
        done
          ? "border border-primary/30 bg-primary/10 cursor-pointer"
          : cn("cursor-grab", isDragging && "cursor-grabbing")
      )}
      style={done ? undefined : {
        border: "2px solid transparent",
        background: progressBorderGradient,
        transition: isDragging ? "none" : "background 300ms ease",
      }}
    >
      {/* Counter — stops pointer events so it doesn't trigger drag */}
      <span className="shrink-0" onPointerDown={(e) => e.stopPropagation()}>
        {editingCount ? (
          <input
            ref={inputRef}
            type="number"
            min={0}
            max={target}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleInputKey}
            className="w-16 text-center text-xs font-medium tabular-nums rounded-[8px] border border-primary/40 bg-background text-foreground px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        ) : (
          <button
            type="button"
            onClick={openEdit}
            className="text-xs font-medium tabular-nums text-foreground bg-muted hover:bg-[#EDE5E3] border border-border rounded-[8px] px-2 py-0.5 transition-colors"
          >
            {liveProgress}/{target}
          </button>
        )}
      </span>
    </HabitCard>
  );
}
