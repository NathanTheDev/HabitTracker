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

const app = express();

// Security headers
app.use(helmet());

// CORS — credentials required for SuperTokens session cookies
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", ...require("supertokens-node").getAllCORSHeaders()],
  })
);

// Global rate limiter
app.use(globalLimiter);

// Stricter rate limit on auth routes
app.use("/api/auth", authLimiter);

// Body parser — 10kb limit prevents payload flooding
app.use(express.json({ limit: "10kb" }));

// SuperTokens middleware — handles all /auth/* routes
app.use(middleware());

// API routes
app.use("/api/habits", habitsRouter);

// SuperTokens error handler — must come before custom error handler
app.use(stErrorHandler());

// Custom error handler — no stack traces in production
app.use(errorHandler);

export default app;
