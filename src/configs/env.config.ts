import { Logger } from '@nestjs/common';
import dotenv from 'dotenv';
import path from 'path';
import * as z from 'zod/v4';

const envFile =
  process.env.DOTENV_CONFIG_PATH ||
  (process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env');

dotenv.config({ path: path.resolve(process.cwd(), envFile), override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number(),
  BACKEND_URL: z.url(),
  DATABASE_URL: z.url(),
  ENCRYPTION_KEY: z.string(),
  ENCRYPTION_SALT: z.string(),
  ENCRYPTION_ALGORITHM: z.string(),
  JWT_SECRET: z.string(),
  SESSION_EXPIRES_IN_DAY: z.coerce.number(),
  APP_SECRET_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  Logger.error(
    '❌ Invalid environment variables',
    JSON.stringify(_env.error.format(), null, 2),
  );

  process.exit(1);
}

const envConfig = _env.data;

export { envConfig };
