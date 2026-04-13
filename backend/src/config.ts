import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3001),
  FRONTEND_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  SUPERTOKENS_CONNECTION_URI: z.string().url(),
  SUPERTOKENS_API_KEY: z.string().min(1),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
