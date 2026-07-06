import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/me", requireAuth, userController.getMe);
router.patch("/me", requireAuth, userController.updateMe);

export default router;
