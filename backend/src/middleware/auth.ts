
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response, NextFunction } from "express";

export const requireAuth = verifySession();

export const getSession = (
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  verifySession()(req, res, next);
};