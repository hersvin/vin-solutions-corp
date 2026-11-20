import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { AuditEvent } from '../../entities/audit_event.entity.js';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEvent)
    private readonly auditRepo: Repository<AuditEvent>,
  ) {}

  async record(body: {
    actorUserId?: string | null;
    module: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    ip?: string | null;
    correlationId?: string | null;
  }): Promise<AuditEvent> {
    const event = this.auditRepo.create({
      actorUserId: body.actorUserId ?? null,
      module: body.module,
      entityType: body.entityType,
      entityId: body.entityId ?? null,
      action: body.action,
      before: body.before ?? null,
      after: body.after ?? null,
      ip: body.ip ?? null,
      at: new Date(),
      correlationId: body.correlationId ?? null,
    });
    return this.auditRepo.save(event);
  }

  async list(filters: {
    module?: string;
    entityType?: string;
    actorUserId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<AuditEvent[]> {
    const where: FindOptionsWhere<AuditEvent> = {};

    if (filters.module) where.module = filters.module;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.actorUserId) where.actorUserId = filters.actorUserId;

    if (filters.from && filters.to) {
      where.at = Between(new Date(filters.from), new Date(filters.to));
    }

    return this.auditRepo.find({
      where,
      order: { at: 'DESC' },
      take: filters.limit ?? 50,
    });
  }
}
