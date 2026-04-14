import { Router } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

import { validateBody } from "../middleware/validate";
import { createHabitSchema, updateHabitSchema, createCompletionSchema } from "../schemas/habits";
import * as habitsController from "../controllers/habitsController";
import * as completionsController from "../controllers/completionsController";

const router = Router();

router.get("/", verifySession(), habitsController.getHabits);
router.post("/", verifySession(), validateBody(createHabitSchema), habitsController.createHabit);
router.patch("/:id", verifySession(), validateBody(updateHabitSchema), habitsController.updateHabit);
router.delete("/:id", verifySession(), habitsController.deleteHabit);

router.get("/:id/completions", verifySession(), completionsController.getCompletions);
router.post("/:id/completions", verifySession(), validateBody(createCompletionSchema), completionsController.createCompletion);
router.delete("/:id/completions", verifySession(), completionsController.deleteCompletion);

export default router;
