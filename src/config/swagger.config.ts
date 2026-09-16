import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Swagger');

export const swaggerConfiguration = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription(
      'Restaurant management platform: tables, menu and reservations.',
    )
    .setVersion('1.0')
    .addTag('Health', 'Service status')
    .addTag('Tables', 'Physical tables of the restaurant')
    .addTag('Categories', 'Menu categories')
    .addTag('Products', 'Menu products')
    .addTag('Menu', 'Public menu')
    .addTag('Reservations', 'Table reservations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  logger.log('Docs available at /api/docs');
};
