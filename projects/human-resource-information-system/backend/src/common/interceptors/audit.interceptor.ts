import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service.js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method: string = request.method;

    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const user = request.user as { id?: string } | undefined;

    if (!isMutation || !user) {
      return next.handle();
    }

    const controllerName = context.getClass().constructor.name;
    const module = controllerName.replace('Controller', '').toLowerCase();
    const correlationId = request.headers['x-correlation-id'] as
      | string
      | undefined;

    this.logger.debug(
      `AuditInterceptor is best-effort; logging mutation for user ${user.id}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.auditService
          .record({
            actorUserId: user.id,
            module,
            entityType: context.getHandler().name,
            action: method.toLowerCase(),
            correlationId: correlationId ?? null,
          })
          .catch((err: Error) => {
            this.logger.error(`Audit recording failed: ${err.message}`);
          });
      }),
    );
  }
}
