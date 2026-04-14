import { Response, NextFunction } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

import * as habitService from "../services/habitService";

export async function getHabits(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.session!.getUserId();
    const habits = await habitService.getAll(userId);
    res.json(habits);
  } catch (err) {
    next(err);
  }
}

export async function createHabit(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.session!.getUserId();
    const habit = await habitService.create(userId, req.body);
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
}

export async function updateHabit(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.session!.getUserId();
    const habit = await habitService.update(userId, req.params.id, req.body);
    if (!habit) return void res.sendStatus(404);
    res.json(habit);
  } catch (err) {
    next(err);
  }
}

export async function deleteHabit(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.session!.getUserId();
    const result = await habitService.remove(userId, req.params.id);
    if (!result) return void res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
