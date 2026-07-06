import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";
import { firebaseAuth } from "../firebase";
import prisma from "../prisma";

export async function getMe(req: AuthedRequest, res: Response) {
  const userId = req.userId!;
  const [user, profile] = await Promise.all([
    firebaseAuth.getUser(userId),
    prisma.userProfile.findUnique({ where: { userId } }),
  ]);
  if (!user) return res.status(404).json({ message: "User not found" });
  const timeJoined = new Date(user.metadata.creationTime).getTime();
  res.json({ email: user.email, timeJoined, displayName: profile?.displayName ?? null });
}

export async function updateMe(req: AuthedRequest, res: Response) {
  const userId = req.userId!;
  const { displayName } = req.body as { displayName?: string };

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: { displayName: displayName ?? null },
    create: { userId, displayName: displayName ?? null },
  });

  res.json({ displayName: profile.displayName });
}
