import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { config } from "../config";

const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
  P2000: { status: 400, message: "Input value too long" },
  P2002: { status: 409, message: "Resource already exists" },
  P2003: { status: 400, message: "Related resource not found" },
  P2025: { status: 404, message: "Not found" },
};

export function errorHandler(
  err: Error & { statusCode?: number; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = PRISMA_ERROR_MAP[err.code];
    if (mapped) {
      return void res.status(mapped.status).json({ error: mapped.message });
    }
    (err as unknown as { statusCode: number }).statusCode = 500;
  }

  const statusCode = (err as { statusCode?: number; status?: number }).statusCode
    ?? (err as { status?: number }).status
    ?? 500;

  const message =
    config.NODE_ENV === "production" && statusCode >= 500
      ? "Internal server error"
      : (err.message ?? "Internal server error");

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}
