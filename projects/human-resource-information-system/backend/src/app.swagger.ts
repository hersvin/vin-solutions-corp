import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { apiReference } from '@scalar/nestjs-api-reference';

/**
 * OpenAPI JSON + Scalar UI.
 *
 * - GET /api/v1/docs/json  -> OpenAPI 3.1 document
 * - GET /api/v1/docs       -> Scalar HTML reference (browser)
 */
export function setupApiDocs(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Hersvin HRIS API')
    .setDescription('NestJS REST API for the Hersvin human-resource system.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // JSON document endpoint
  SwaggerModule.setup('/api/v1/docs/json', app, document);

  // Scalar UI at /api/v1/docs
  app.use(
    '/api/v1/docs',
    apiReference({
      url: '/api/v1/docs/json',
      theme: 'default',
    }),
  );
}
