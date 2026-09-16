import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule, ObserveInstrument } from './app.module.js';
import { swaggerConfiguration } from './config/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const config = app.get(ConfigService);

  // Security HTTP headers.
  app.use(helmet());

  // Allowed origins, comma separated in CORS_ORIGIN.
  app.enableCors({
    origin: config
      .getOrThrow<string>('app.corsOrigin')
      .split(',')
      .map((origin) => origin.trim()),
  });

  // Every endpoint is served under /api/v1 (RN-003).
  app.setGlobalPrefix('api/v1');

  // Validates and transforms the payload of every request (RN-010, RN-011).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  swaggerConfiguration(app);

  await app.listen(config.getOrThrow<number>('app.port'));
}

await bootstrap();
