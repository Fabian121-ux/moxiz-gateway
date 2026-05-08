/**
 * @fileOverview Environment variable management.
 * Ensures all required variables are present and typed.
 */

import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:9002'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:9002/api'),
  JWT_SECRET: z.string().min(1).default('test_secret'),
  WEBHOOK_SIGNING_SECRET: z.string().min(1).default('test_webhook_secret'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  WEBHOOK_SIGNING_SECRET: process.env.WEBHOOK_SIGNING_SECRET,
});
