import { Router } from "express";
import { requireAuth } from "../middleware/auth";

import { validateBody } from "../middleware/validate";
import { createHabitSchema, updateHabitSchema, createCompletionSchema } from "../schemas/habits";
import * as habitsController from "../controllers/habitsController";
import * as completionsController from "../controllers/completionsController";

const router = Router();

router.get("/", requireAuth, habitsController.getHabits);
router.post("/", requireAuth, validateBody(createHabitSchema), habitsController.createHabit);
router.patch("/:id", requireAuth, validateBody(updateHabitSchema), habitsController.updateHabit);
router.delete("/:id", requireAuth, habitsController.deleteHabit);

router.get("/:id/completions", requireAuth, completionsController.getCompletions);
router.post("/:id/completions", requireAuth, validateBody(createCompletionSchema), completionsController.createCompletion);
router.delete("/:id/completions", requireAuth, completionsController.deleteCompletion);

export default router;
