import { Response, NextFunction } from "express";
import { AuthedRequest } from "../middleware/auth";

import * as completionService from "../services/completionService";
import { habitCompletionResponseSchema } from "../schemas/habits";

export async function getCompletions(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const completions = await completionService.getAll(userId, req.params.id);
    if (!completions) return void res.sendStatus(404);
    res.json(habitCompletionResponseSchema.array().parse(completions));
  } catch (err) {
    next(err);
  }
}

export async function createCompletion(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const completion = await completionService.create(userId, req.params.id, {
      completedAt: req.body.completedAt as string | undefined,
      quantityProgress: req.body.quantityProgress,
      notes: req.body.notes,
    });
    if (!completion) return void res.sendStatus(404);
    res.status(201).json(habitCompletionResponseSchema.parse(completion));
  } catch (err) {
    next(err);
  }
}

export async function deleteCompletion(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const result = await completionService.deleteForDate(
      userId,
      req.params.id,
      req.query.date as string | undefined
    );
    if (result === null) return void res.sendStatus(404);
    if (result === "invalid_date") return void res.status(400).json({ error: "Invalid date query parameter" });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
