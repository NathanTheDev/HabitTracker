import { NextFunction, Request, Response } from "express";
import { config } from "../config";

export function errorHandler(
  err: Error & { statusCode?: number; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode ?? err.status ?? 500;
  const message =
    config.NODE_ENV === "production" && statusCode >= 500
      ? "Internal server error"
      : (err.message ?? "Internal server error");

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}
