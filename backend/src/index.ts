import app from "./app";
import { config } from "./config";
import prisma from "./prisma";

const server = app.listen(config.PORT, () => {
  console.log(`HabitTracker backend running on port ${config.PORT}`);
});

// Allow tsx watch to cleanly restart — release the port on SIGTERM
process.on("SIGTERM", () => server.close(() => prisma.$disconnect()));
