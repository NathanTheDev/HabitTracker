import { Request, Response } from "express";

export default class UserController {
  static async me(req: Request, res: Response) {
    return res.json({ user: req.user });
  }
}
