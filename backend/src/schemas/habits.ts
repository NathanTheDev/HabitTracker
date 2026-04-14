import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
  quantity: z.number().int().positive().optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
  quantity: z.number().int().positive().optional(),
});

export const createCompletionSchema = z.object({
  completedAt: z.string().datetime().optional(),
  quantityProgress: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Response schemas

export const habitCompletionResponseSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  completedAt: z.date(),
  quantityProgress: z.number().int().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
});

export const habitResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  frequency: z.enum(["DAILY", "WEEKLY"]),
  quantity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completions: z.array(habitCompletionResponseSchema).optional(),
});
