
import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, required = true): string => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
};

export const IP = getEnv("IP", false) || "localhost";
export const PORT = parseInt(getEnv("PORT", false) || "8000");

export const JWT_SECRET_KEY = getEnv("JWT_SECRET_KEY");
export const SUPABASE_URL = getEnv("SUPABASE_URL");
export const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");

export const COOKIE_SAME_SITE = "lax" as const;

