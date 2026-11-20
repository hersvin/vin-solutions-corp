import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, concatMap, of } from 'rxjs';
import { RbacService } from '../../modules/rbac/rbac.service.js';
import { maskValue } from '../utils/mask.util.js';

type MaskedRequest = Record<string, unknown> & { user?: { id: string; roles?: string[] } };

/**
 * FieldMaskInterceptor resolves field-level masks for the requesting user
 * and applies them to all properties in the response object.
 */
@Injectable()
export class FieldMaskInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FieldMaskInterceptor.name);

  constructor(private readonly rbacService: RbacService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest<MaskedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      return next.handle();
    }

    return next.handle().pipe(
      concatMap((data: unknown) => {
        return this.rbacService.resolvePermissions(userId).then(
          ({ fieldMasks }) =>
            of(
              Object.keys(fieldMasks).length === 0
                ? data
                : this.applyMasks(data, fieldMasks),
            ),
          (err: unknown) => {
            this.logger.warn(
              `field-mask: could not resolve permissions for user ${userId}: ${
                (err as Error)?.message ?? String(err)
              }`,
            );
            return of(data);
          },
        );
      }),
    );
  }

  private applyMasks(
    data: unknown,
    fieldMasks: Record<string, string>,
  ): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.applyMasks(item, fieldMasks));
    }
    if (data && typeof data === 'object') {
      const result = { ...(data as Record<string, unknown>) };
      for (const [field, maskType] of Object.entries(fieldMasks)) {
        if (field in result) {
          result[field] = maskValue(result[field], maskType);
        }
      }
      return result;
    }
    return data;
  }
}
