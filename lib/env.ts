import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  NEXTAUTH_URL: z.string().url().optional(),
  BASE_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
