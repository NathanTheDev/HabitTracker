import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { getUser } from "supertokens-node";
import prisma from "../prisma";

export async function getMe(req: SessionRequest, res: Response) {
  const userId = req.session!.getUserId();
  const [user, profile] = await Promise.all([
    getUser(userId),
    prisma.userProfile.findUnique({ where: { userId } }),
  ]);
  if (!user) return res.status(404).json({ message: "User not found" });
  const login = user.loginMethods[0];
  res.json({ email: login?.email, timeJoined: user.timeJoined, displayName: profile?.displayName ?? null });
}

export async function updateMe(req: SessionRequest, res: Response) {
  const userId = req.session!.getUserId();
  const { displayName } = req.body as { displayName?: string };

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: { displayName: displayName ?? null },
    create: { userId, displayName: displayName ?? null },
  });

  res.json({ displayName: profile.displayName });
}
