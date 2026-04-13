import { Router } from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const router = Router();

// Phase 3: replace 501 stubs with real service calls

router.get("/", verifySession(), (_req, res) => {
  res.sendStatus(501);
});

router.post("/", verifySession(), (_req, res) => {
  res.sendStatus(501);
});

router.patch("/:id", verifySession(), (_req, res) => {
  res.sendStatus(501);
});

router.delete("/:id", verifySession(), (_req, res) => {
  res.sendStatus(501);
});

router.post("/:id/completions", verifySession(), (_req, res) => {
  res.sendStatus(501);
});

router.get("/:id/completions", verifySession(), (_req, res) => {
  res.sendStatus(501);
});

export default router;
