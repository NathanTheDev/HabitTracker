"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Habit } from "@/lib/types";

type Range = "week" | "month" | "year" | "all";

interface Props {
  habits: Habit[];
}

function buildChartData(habits: Habit[], range: Range) {
  const now = new Date();
  const completions = habits.flatMap((h) => h.completions ?? []);

  let buckets: { label: string; date: Date }[] = [];

  if (range === "week") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      buckets.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d,
      });
    }
  } else if (range === "month") {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      buckets.push({
        label: i % 5 === 0 ? d.toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "",
        date: d,
      });
    }
  } else if (range === "year") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        label: d.toLocaleDateString("en-US", { month: "short" }),
        date: d,
      });
    }
  } else {
    // all time: monthly buckets from earliest completion
    const earliest =
      completions.length > 0
        ? new Date(
            Math.min(...completions.map((c) => new Date(c.completedAt).getTime()))
          )
        : new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const start = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const d = new Date(start);
    while (d <= now) {
      buckets.push({
        label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        date: new Date(d),
      });
      d.setMonth(d.getMonth() + 1);
    }
  }

  const totalHabits = habits.length || 1;

  return buckets.map(({ label, date }) => {
    let count: number;
    if (range === "year" || range === "all") {
      count = completions.filter((c) => {
        const d = new Date(c.completedAt);
        return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
      }).length;
    } else {
      count = completions.filter((c) => {
        const d = new Date(c.completedAt);
        return (
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
        );
      }).length;
    }
    const pct = Math.min(100, Math.round((count / totalHabits) * 100));
    return { label, completed: pct };
  });
}

const RANGES: { key: Range; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "all", label: "All time" },
];

export function ConsistencyChart({ habits }: Props) {
  const [range, setRange] = useState<Range>("week");
  const data = useMemo(() => buildChartData(habits, range), [habits, range]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Completed</CardTitle>
        <div className="flex gap-1">
          {RANGES.map(({ key, label }) => (
            <Button
              key={key}
              size="sm"
              variant={range === key ? "default" : "ghost"}
              onClick={() => setRange(key)}
              className="text-xs px-3 h-7"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="consistencyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C58D85" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#C58D85" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE5E3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#8A7370" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#8A7370" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #EDE5E3",
                borderRadius: 12,
                fontSize: 12,
                color: "#3D2B29",
              }}
              formatter={(value) => [`${value ?? 0}%`, "Completed"]}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#C58D85"
              strokeWidth={2}
              fill="url(#consistencyGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#C58D85", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
