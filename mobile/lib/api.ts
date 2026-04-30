import { logout } from './auth';
import { storage } from './storage';
import type {
  CreateCompletionInput,
  CreateHabitInput,
  Habit,
  HabitCompletion,
  UpdateHabitInput,
  User,
} from './types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function refreshTokens(): Promise<boolean> {
  const refresh = await storage.getRefresh();
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/api/auth/session/refresh`, {
    method: 'POST',
    headers: { 'st-auth-mode': 'header', Authorization: `Bearer ${refresh}` },
  });

  if (!res.ok) return false;

  const newAccess = res.headers.get('st-access-token');
  const newRefresh = res.headers.get('st-refresh-token');
  if (!newAccess) return false;

  await storage.setTokens(newAccess, newRefresh ?? refresh);
  return true;
}

async function request<T>(path: string, init?: RequestInit, isRetry = false): Promise<T> {
  const token = await storage.getAccess();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'st-auth-mode': 'header',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401 && !isRetry) {
    const refreshed = await refreshTokens();
    if (refreshed) return request<T>(path, init, true);
    await logout();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  habits: {
    list: () => request<Habit[]>('/api/habits'),

    create: (data: CreateHabitInput) =>
      request<Habit>('/api/habits', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: UpdateHabitInput) =>
      request<Habit>(`/api/habits/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: string) => request<void>(`/api/habits/${id}`, { method: 'DELETE' }),

    complete: (id: string, data?: CreateCompletionInput) =>
      request<HabitCompletion>(`/api/habits/${id}/completions`, {
        method: 'POST',
        body: JSON.stringify(data ?? {}),
      }),

    uncomplete: (id: string, date?: string) =>
      request<void>(
        `/api/habits/${id}/completions${date ? `?${new URLSearchParams({ date })}` : ''}`,
        { method: 'DELETE' }
      ),

    completions: (id: string) => request<HabitCompletion[]>(`/api/habits/${id}/completions`),
  },

  user: {
    me: () => request<User>('/api/user/me'),
    updateMe: (displayName: string | null) =>
      request<{ displayName: string | null }>('/api/user/me', {
        method: 'PATCH',
        body: JSON.stringify({ displayName }),
      }),
  },
};
