import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL is required and must be a valid URL."),
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
