import { Router } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { z } from "zod";

import { validateBody } from "../middleware/validate";
import * as habitService from "../services/habitService";
import * as completionService from "../services/completionService";

const router = Router();

const createHabitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
  quantity: z.number().int().positive().optional(),
});

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
  quantity: z.number().int().positive().optional(),
});

const createCompletionSchema = z.object({
  completedAt: z.string().datetime().optional(),
  quantityProgress: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

router.get("/", verifySession(), async (req, res, next) => {
  try {
    const userId = (req as SessionRequest).session!.getUserId();
    const habits = await habitService.getAll(userId);
    res.json(habits);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifySession(), validateBody(createHabitSchema), async (req, res, next) => {
  try {
    const userId = (req as SessionRequest).session!.getUserId();
    const habit = await habitService.create(userId, req.body);
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", verifySession(), validateBody(updateHabitSchema), async (req, res, next) => {
  try {
    const userId = (req as SessionRequest).session!.getUserId();
    const habit = await habitService.update(userId, req.params.id, req.body);
    if (!habit) return void res.sendStatus(404);
    res.json(habit);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", verifySession(), async (req, res, next) => {
  try {
    const userId = (req as SessionRequest).session!.getUserId();
    const result = await habitService.remove(userId, req.params.id);
    if (!result) return void res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/completions",
  verifySession(),
  validateBody(createCompletionSchema),
  async (req, res, next) => {
    try {
      const userId = (req as SessionRequest).session!.getUserId();
      const completion = await completionService.create(userId, req.params.id, {
        completedAt: req.body.completedAt ? new Date(req.body.completedAt) : new Date(),
        quantityProgress: req.body.quantityProgress,
        notes: req.body.notes,
      });
      if (!completion) return void res.sendStatus(404);
      res.status(201).json(completion);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id/completions", verifySession(), async (req, res, next) => {
  try {
    const userId = (req as SessionRequest).session!.getUserId();
    const completions = await completionService.getAll(userId, req.params.id);
    if (!completions) return void res.sendStatus(404);
    res.json(completions);
  } catch (err) {
    next(err);
  }
});

export default router;
