
import { Request, Response } from "express";
import { supabase } from "../util.js";
import Session from "supertokens-node/recipe/session";

export default class UserController {
    static async me(req: Request, res: Response) {
        const session = await Session.getSession(req, res);
        const userId = session.getUserId();

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        if (!data) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json(data);
    }
}

