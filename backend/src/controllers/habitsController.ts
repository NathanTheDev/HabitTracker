import { Response, NextFunction } from "express";
import { AuthedRequest } from "../middleware/auth";

import * as habitService from "../services/habitService";
import { habitResponseSchema } from "../schemas/habits";

export async function getHabits(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const habits = await habitService.getAll(userId);
    res.json(habitResponseSchema.array().parse(habits));
  } catch (err) {
    next(err);
  }
}

export async function createHabit(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const habit = await habitService.create(userId, req.body);
    res.status(201).json(habitResponseSchema.parse(habit));
  } catch (err) {
    next(err);
  }
}

export async function updateHabit(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const habit = await habitService.update(userId, req.params.id, req.body);
    if (!habit) return void res.sendStatus(404);
    res.json(habitResponseSchema.parse(habit));
  } catch (err) {
    next(err);
  }
}

export async function deleteHabit(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const result = await habitService.remove(userId, req.params.id);
    if (!result) return void res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
