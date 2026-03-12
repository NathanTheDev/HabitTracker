import { Router, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { requireAuth } from "../middleware/auth.js";
import { supabase } from "../util.js";
import HabitController from "../controllers/habit.js";

const router = Router();

router.post("/", requireAuth, HabitController.create);

router.patch("/:id/complete", requireAuth, HabitController.patch);

router.get("/", requireAuth, HabitController.getAll);

export default router;
