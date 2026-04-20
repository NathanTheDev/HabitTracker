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
  return prisma.$transaction(async (tx) => {
    const existing = await tx.habit.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return tx.habit.update({ where: { id }, data });
  });
}

export async function remove(userId: string, id: string) {
  const result = await prisma.habit.deleteMany({ where: { id, userId } });
  return result.count > 0 ? true : null;
}
