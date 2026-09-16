import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * Connection used by the TypeORM CLI to generate and run migrations.
 * It is separate from the application one: the CLI does not boot NestJS,
 * so it has no ConfigService and reads the environment directly.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
