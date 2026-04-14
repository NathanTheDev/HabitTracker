import prisma from "../prisma";

export async function getAll(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return null;
  return prisma.habitCompletion.findMany({
    where: { habitId },
    orderBy: { completedAt: "desc" },
  });
}

export async function create(
  userId: string,
  habitId: string,
  data: { completedAt: Date; quantityProgress?: number; notes?: string }
) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return null;
  // normalise to midnight UTC so the unique constraint enforces one per day
  const d = data.completedAt;
  const completedAt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  return prisma.habitCompletion.upsert({
    where: { habitId_completedAt: { habitId, completedAt } },
    create: { habitId, completedAt, quantityProgress: data.quantityProgress, notes: data.notes },
    update: { quantityProgress: data.quantityProgress, notes: data.notes },
  });
}
