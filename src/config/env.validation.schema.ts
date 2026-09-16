import * as z from 'zod';

/**
 * Shape the environment variables must have.
 * If a required one is missing or malformed, the app refuses to boot (RN-002).
 */
export const envValidationSchema = z.object({
  APP_PORT: z.coerce.number().int().positive(),
  APP_NODE: z.enum(['development', 'test', 'production']),
  CORS_ORIGIN: z.string().min(1),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  OBSERVE_APP_KEY: z.string().optional(),
  OBSERVE_APP_SECRET: z.string().optional(),
  OBSERVE_SERVICE_ID: z.string().optional(),
});

/**
 * ConfigModule calls this function on startup.
 * Returns the configuration untouched when it is valid, or throws a readable
 * error listing every problem when it is not.
 */
export const validateEnv = (config: Record<string, unknown>) => {
  const result = envValidationSchema.safeParse(config);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return config;
};
