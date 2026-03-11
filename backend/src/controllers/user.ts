import { Request, Response } from "express";
import { supabase } from "../util.js";

export default class UserController {
  static async me(req: Request, res: Response) {
    return res.json({ user: req.user });
  }
}
