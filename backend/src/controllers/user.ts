
import type { Request, Response } from "express";
import { supabase } from "../util.js";

export default class UserController {
    static me = async (req: Request, res: Response): Promise<void> => {
        try {
            const { data, error } = await supabase
                .schema("public")
                .from("users")
                .select()
                .eq("id", req.user!.sub)
                .maybeSingle();

            if (error) {
                const message = { error: error.message };
                res.status(500).json(message);
                return;
            }

            if (!data) {
                const message = { error: "User profile not found" };
                res.status(404).json(message);
                return;
            }

            res.json(data)
        } catch (err) {
            console.log("I caught an error");
            res.status(500).json({ message: "Internal server error" });
    }
  };
}

