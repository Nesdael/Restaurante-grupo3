/**
 * Groups the environment variables into named objects.
 * They are then read with ConfigService.get('app.port'), 'database.host', etc.
 */
export const EnvConfig = () => ({
  app: {
    port: Number(process.env.APP_PORT ?? 3000),
    env: process.env.APP_NODE ?? 'development',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  observe: {
    appKey: process.env.OBSERVE_APP_KEY,
    appSecret: process.env.OBSERVE_APP_SECRET,
    serviceId: process.env.OBSERVE_SERVICE_ID,
  },
});
