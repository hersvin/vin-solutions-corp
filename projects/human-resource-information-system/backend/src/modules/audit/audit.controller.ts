import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuditService } from './audit.service.js';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(
    @Query('module') module?: string,
    @Query('entityType') entityType?: string,
    @Query('actorUserId') actorUserId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.list({
      module,
      entityType,
      actorUserId,
      from,
      to,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post()
  record(
    @Body()
    body: {
      actorUserId?: string;
      module: string;
      entityType: string;
      entityId?: string;
      action: string;
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
      ip?: string;
      correlationId?: string;
    },
  ) {
    return this.auditService.record(body);
  }
}
