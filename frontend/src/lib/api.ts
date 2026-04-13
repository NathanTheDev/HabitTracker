import type {
  CreateCompletionInput,
  CreateHabitInput,
  Habit,
  HabitCompletion,
  UpdateHabitInput,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error ?? "Request failed");
  }

  // 204 No Content — return undefined cast to T
  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  habits: {
    list: () => request<Habit[]>("/api/habits"),

    create: (data: CreateHabitInput) =>
      request<Habit>("/api/habits", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateHabitInput) =>
      request<Habit>(`/api/habits/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<void>(`/api/habits/${id}`, { method: "DELETE" }),

    complete: (id: string, data?: CreateCompletionInput) =>
      request<HabitCompletion>(`/api/habits/${id}/completions`, {
        method: "POST",
        body: JSON.stringify(data ?? {}),
      }),

    completions: (id: string) =>
      request<HabitCompletion[]>(`/api/habits/${id}/completions`),
  },
};
