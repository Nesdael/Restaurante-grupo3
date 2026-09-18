import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * PostgreSQL connection.
 *
 * autoLoadEntities: every module registers its own entity with
 * TypeOrmModule.forFeature([...]) and TypeORM picks it up on its own, so nobody
 * has to edit this file when a new module is added.
 *
 * synchronize: always false. Schema changes go through versioned migrations
 * (RN-008, RN-009).
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
  synchronize: true,
});
