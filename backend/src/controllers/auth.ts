import type { Request, Response } from "express";

export class AuthController {
    authenticate = async (req: Request, res: Response) => {
        res.json({ message: "Test put" });
    }
}
