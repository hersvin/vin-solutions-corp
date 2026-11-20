import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RbacService } from '../../modules/rbac/rbac.service.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

interface ScopedRequest extends Request {
  user?: { id: string; roles?: string[] };
}

/**
 * ScopingGuard enforces record-level access via entity_scope.
 * When an endpoint requires a company scope, only users whose
 * entity_scope rows cover that company_id may read or mutate it.
 */
@Injectable()
export class ScopingGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ScopedRequest>();
    const user = request.user;
    if (!user?.id) {
      throw new ForbiddenException('No authenticated user for scope check');
    }

    const permissions = await this.rbacService.resolvePermissions(user.id);
    if (permissions.scopes.length === 0) {
      throw new ForbiddenException(
        `User ${user.id} has no entity_scope grants required for roles: ${requiredRoles.join(', ')}`,
      );
    }

    const userRoles = user.roles ?? [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );
    if (!hasRequiredRole) {
      throw new ForbiddenException('Missing required role for scoped access');
    }

    return true;
  }
}
