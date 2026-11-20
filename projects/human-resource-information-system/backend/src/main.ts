import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RbacService } from './modules/rbac/rbac.service.js';
import {
  GlobalExceptionFilter,
} from './common/filters/global-exception.filter.js';
import { FieldMaskInterceptor } from './common/interceptors/field-mask.interceptor.js';
import { JwtGuard } from './common/guards/jwt.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { ScopingGuard } from './common/guards/scoping.guard.js';
import { AppModule } from './app.module.js';
import { setupApiDocs } from './app.swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);
  const rbacService = app.get(RbacService);

  const jwtGuard = new JwtGuard(jwtService, configService);
  const rolesGuard = new RolesGuard(reflector);
  const scopingGuard = new ScopingGuard(reflector, rbacService);
  const fieldMaskInterceptor = new FieldMaskInterceptor(rbacService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(fieldMaskInterceptor);

  // Apply guards in order: Jwt -> Roles -> Scoping
  app.useGlobalGuards(jwtGuard, rolesGuard, scopingGuard);

  setupApiDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

