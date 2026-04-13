"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EmojiPicker, { type EmojiClickData, Theme, Categories } from "emoji-picker-react";
import { Button } from "@/components/ui/button";

export default function NewHabitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏃");
  const [quantity, setQuantity] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleEmojiClick(data: EmojiClickData) {
    setEmoji(data.emoji);
    setPickerOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(
      `Habit Created!\n\nEmoji: ${emoji}\nName: ${name}${quantity ? `\nQuantity: ${quantity}` : ""}`
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <button className="h-9 w-9 rounded-[12px] flex items-center justify-center bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">New habit</h1>
            <p className="text-xs text-muted-foreground">Build something consistent</p>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-[16px] border border-border shadow-sm p-6 space-y-6">

          {/* Habit name + emoji */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Habit name <span className="text-primary">*</span>
            </label>
            <div className="flex gap-2 items-center">
              {/* Emoji trigger */}
              <div className="relative" ref={pickerRef}>
                <button
                  type="button"
                  onClick={() => setPickerOpen((o) => !o)}
                  className="h-10 w-10 flex-shrink-0 rounded-[12px] border border-border bg-background flex items-center justify-center text-xl hover:bg-muted transition-colors"
                >
                  {emoji}
                </button>
                {pickerOpen && (
                  <div className="absolute left-0 top-12 z-20">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={Theme.LIGHT}
                      skinTonesDisabled
                      searchPlaceholder="Search emoji..."
                      height={380}
                      width={300}
                      previewConfig={{
                        defaultEmoji: "270f-fe0f",
                        defaultCaption: "What best describes your habit?",
                      }}
                      categories={[
                        { category: Categories.SUGGESTED, name: "✏️ What best describes your habit" },
                        { category: Categories.SMILEYS_PEOPLE, name: "Smileys & People" },
                        { category: Categories.ANIMALS_NATURE, name: "Animals & Nature" },
                        { category: Categories.FOOD_DRINK, name: "Food & Drink" },
                        { category: Categories.TRAVEL_PLACES, name: "Travel & Places" },
                        { category: Categories.ACTIVITIES, name: "Activities" },
                        { category: Categories.OBJECTS, name: "Objects" },
                        { category: Categories.SYMBOLS, name: "Symbols" },
                        { category: Categories.FLAGS, name: "Flags" },
                      ]}
                    />
                  </div>
                )}
              </div>

              {/* Name input */}
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. Morning run"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-10 rounded-[12px] border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label htmlFor="quantity" className="text-sm font-medium text-foreground">
              Quantity
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">optional</span>
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              placeholder="e.g. 5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full h-10 rounded-[12px] border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            <p className="text-xs text-muted-foreground">
              How many times per day? (e.g. Read — 5 pages)
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create habit
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
