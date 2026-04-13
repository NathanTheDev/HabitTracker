export type Frequency = "DAILY" | "WEEKLY";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: Frequency;
  createdAt: string;
  updatedAt: string;
  completions?: HabitCompletion[];
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: string;
  notes?: string;
  createdAt: string;
}

export type CreateHabitInput = {
  name: string;
  description?: string;
  frequency?: Frequency;
};

export type UpdateHabitInput = Partial<CreateHabitInput>;

export type CreateCompletionInput = {
  notes?: string;
};
