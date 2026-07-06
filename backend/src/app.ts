import "./firebase";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { globalLimiter } from "./middleware/rateLimiter";
import habitsRouter from "./routes/habits";
import userRouter from "./routes/user";

const app = express();

app.use(helmet());

const allowedOrigins = config.FRONTEND_ORIGINS.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));

app.use("/api/habits", habitsRouter);
app.use("/api/user", userRouter);

app.use(errorHandler);

export default app;
