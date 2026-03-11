
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { Response, NextFunction } from "express";
import { supabase } from "../util.js";
import { User } from "../types.js";

export const requireAuth = [
  verifySession(),

  async (req: SessionRequest, res: Response, next: NextFunction) => {
    const supertokensId = req.session!.getUserId();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("supertokens_id", supertokensId)
      .single<User>();

    if (error || !data) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = data;
    next();
  },
];