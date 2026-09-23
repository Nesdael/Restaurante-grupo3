import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Folder of this file: src/config in development, dist/config after the build.
const here = dirname(fileURLToPath(import.meta.url));

/**
 * PostgreSQL connection.
 *
 * autoLoadEntities: every module registers its own entity with
 * TypeOrmModule.forFeature([...]), so nobody has to edit this file when a new
 * module is added.
 *
 * synchronize: always false. Schema changes go through versioned migrations
 * (RN-008, RN-009).
 *
 * migrationsRun: pending migrations are applied when the API starts, so
 * `docker compose up` leaves the database ready. If a migration fails, the API
 * does not start.
 */
export const databaseConfiguration = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getOrThrow<string>('database.host'),
  port: config.getOrThrow<number>('database.port'),
  username: config.getOrThrow<string>('database.user'),
  password: config.getOrThrow<string>('database.password'),
  database: config.getOrThrow<string>('database.name'),
  autoLoadEntities: true,
  synchronize: false,
  // Errors always; in development also warnings and which migrations were applied.
  logging:
    config.get<string>('app.env') === 'development'
      ? ['error', 'warn', 'schema', 'migration']
      : ['error'],
  // src/database/migrations/*.ts in development, dist/database/migrations/*.js in the build.
  migrations: [join(here, '..', 'database', 'migrations', '*.{ts,js}')],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  // Each migration in its own transaction: if one fails, the previous ones stay applied.
  migrationsTransactionMode: 'each',
});
