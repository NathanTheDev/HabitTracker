import prisma from "../prisma";

export async function getAll(userId: string) {
  return prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { completions: { orderBy: { completedAt: "desc" } } },
  });
}

export async function create(
  userId: string,
  data: { name: string; description?: string; frequency?: string; quantity?: number }
) {
  return prisma.habit.create({
    data: { userId, ...data },
  });
}

export async function update(
  userId: string,
  id: string,
  data: { name?: string; description?: string; frequency?: string; quantity?: number }
) {
  const existing = await prisma.habit.findFirst({ where: { id, userId } });
  if (!existing) return null;
  return prisma.habit.update({ where: { id }, data });
}

export async function remove(userId: string, id: string) {
  const existing = await prisma.habit.findFirst({ where: { id, userId } });
  if (!existing) return null;
  await prisma.habit.delete({ where: { id } });
  return true;
}
