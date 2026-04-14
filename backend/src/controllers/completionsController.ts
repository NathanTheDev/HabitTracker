import { Response, NextFunction } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

import * as completionService from "../services/completionService";
import { habitCompletionResponseSchema } from "../schemas/habits";

export async function getCompletions(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.session!.getUserId();
    const completions = await completionService.getAll(userId, req.params.id);
    if (!completions) return void res.sendStatus(404);
    res.json(habitCompletionResponseSchema.array().parse(completions));
  } catch (err) {
    next(err);
  }
}

export async function createCompletion(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.session!.getUserId();
    const completion = await completionService.create(userId, req.params.id, {
      completedAt: req.body.completedAt ? new Date(req.body.completedAt) : new Date(),
      quantityProgress: req.body.quantityProgress,
      notes: req.body.notes,
    });
    if (!completion) return void res.sendStatus(404);
    res.status(201).json(habitCompletionResponseSchema.parse(completion));
  } catch (err) {
    next(err);
  }
}
