// supertokens.ts must be imported before anything else
import "./supertokens";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { middleware, errorHandler as stErrorHandler } from "supertokens-node/framework/express";

import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { authLimiter, globalLimiter } from "./middleware/rateLimiter";
import habitsRouter from "./routes/habits";
import userRouter from "./routes/user";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", ...require("supertokens-node").getAllCORSHeaders()],
  })
);

app.use(globalLimiter);
app.use("/api/auth", authLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(middleware());

app.use("/api/habits", habitsRouter);
app.use("/api/user", userRouter);

// must come before custom error handler
app.use(stErrorHandler());
app.use(errorHandler);

export default app;
