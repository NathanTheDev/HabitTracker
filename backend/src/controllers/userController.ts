import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { getUser } from "supertokens-node";

export async function getMe(req: SessionRequest, res: Response) {
  const userId = req.session!.getUserId();
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const login = user.loginMethods[0];
  res.json({ email: login?.email, timeJoined: user.timeJoined });
}
