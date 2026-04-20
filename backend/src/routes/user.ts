import { Router } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/me", verifySession(), userController.getMe);

export default router;
