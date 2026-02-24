
import type { Request, Response } from "express";

export default class UserController {
    static me = async (req: Request, res: Response): Promise<void> => {
        try {
            res.json({ message: "good!" });
        } catch (error) {
            console.error("Authentication error:", error);
            res.status(500).json({ error: error });
        }
    };
}


