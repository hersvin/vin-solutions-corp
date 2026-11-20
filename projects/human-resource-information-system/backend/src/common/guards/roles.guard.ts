import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: { roles?: string[] } }>();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Roles not resolved for this request');
    }

    const allowed = requiredRoles.some((role: string) => user.roles?.includes(role));
    if (!allowed) {
      throw new ForbiddenException('Insufficient role privileges');
    }

    return true;
  }
}
