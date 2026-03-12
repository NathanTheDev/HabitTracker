import { Request, Response } from "express";
import { supabase } from "../util.js";

export default class HabitController {
  static async create(req: Request, res: Response) {
    const { habit_name } = req.body;

    if (!habit_name || typeof habit_name !== "string") {
      return res.status(400).json({ error: "habit_name is required" });
    }

    const { data, error } = await supabase
      .from("habits")
      .insert({
        creator_id: req.user!.id,
        habit_name: habit_name.trim(),
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create habit:", error.message);
      return res.status(500).json({ error: "Failed to create habit" });
    }

    return res.status(201).json({ habit: data });
  }

  static async patch(req: Request, res: Response) {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed must be a boolean" });
    }

    const { data: habit, error: findError } = await supabase
      .from("habits")
      .select("*")
      .eq("id", id)
      .eq("creator_id", req.user!.id)
      .single();

    if (findError || !habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const { data, error: updateError } = await supabase
      .from("habits")
      .update({ completed })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update habit:", updateError.message);
      return res.status(500).json({ error: "Failed to update habit" });
    }

    if (completed) {
      const { error: completionError } = await supabase
        .from("habit_completions")
        .insert({
          habit_id: habit.id,
          user_id: req.user!.id,
          habit_name: habit.habit_name,
        });

      if (completionError) {
        console.error("Failed to log completion:", completionError.message);
      }
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { error: deleteError } = await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habit.id)
        .eq("user_id", req.user!.id)
        .gte("date_completed", today.toISOString());

      if (deleteError) {
        console.error("Failed to delete completion:", deleteError.message);
      }
    }

    return res.json({ habit: data });
  }

  static async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("creator_id", req.user!.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("failed to fetch habits:", error.message);
      return res.status(500).json({ error: "Failed to fetch habits" });
    }

    return res.json({ habits: data });
  }
}
