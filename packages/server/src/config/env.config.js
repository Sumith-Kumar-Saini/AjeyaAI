import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  GEMINI_API_KEY: z.string().min(1),
  LOG_LEVEL: z.string().default('info'),
});

export const env = envSchema.parse(process.env);