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
  data: { completedAt?: string; quantityProgress?: number; notes?: string }
) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return null;
  if (data.quantityProgress !== undefined && data.quantityProgress > habit.quantity) {
    const err = Object.assign(new Error("quantityProgress exceeds habit quantity"), { statusCode: 400 });
    throw err;
  }
  const raw = data.completedAt ? new Date(data.completedAt) : new Date();
  // normalise to midnight UTC so the unique constraint enforces one per day
  const completedAt = new Date(Date.UTC(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate()));
  return prisma.habitCompletion.upsert({
    where: { habitId_completedAt: { habitId, completedAt } },
    create: { habitId, completedAt, quantityProgress: data.quantityProgress, notes: data.notes },
    update: { quantityProgress: data.quantityProgress, notes: data.notes },
  });
}

export async function deleteForDate(userId: string, habitId: string, rawDate?: string) {
  const parsed = rawDate ? new Date(rawDate) : new Date();
  if (rawDate && isNaN(parsed.getTime())) return "invalid_date" as const;
  const completedAt = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
  return prisma.$transaction(async (tx) => {
    const habit = await tx.habit.findFirst({ where: { id: habitId, userId } });
    if (!habit) return null;
    await tx.habitCompletion.deleteMany({ where: { habitId, completedAt } });
    return true;
  });
}
