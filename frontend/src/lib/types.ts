export type Frequency = "DAILY" | "WEEKLY";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: Frequency;
  quantity: number;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
  completions?: HabitCompletion[];
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: string;
  quantityProgress?: number;
  notes?: string;
  createdAt: string;
}

export type CreateHabitInput = {
  name: string;
  description?: string;
  frequency?: Frequency;
  quantity?: number;
};

export type UpdateHabitInput = Partial<CreateHabitInput>;

export type CreateCompletionInput = {
  quantityProgress?: number;
  notes?: string;
};
