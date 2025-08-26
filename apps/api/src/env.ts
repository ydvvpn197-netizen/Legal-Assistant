import { config } from 'dotenv';
import { z } from 'zod';

config();

const defaultDb = 'postgresql://postgres:postgres@localhost:5432/legal_assistant?schema=public';

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url().default(defaultDb)
});

export const env = EnvSchema.parse(process.env);
