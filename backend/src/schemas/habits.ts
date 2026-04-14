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
