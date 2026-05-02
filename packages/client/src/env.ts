import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().default("http://localhost:5000/api"),
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
});
