import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('audit_event')
export class AuditEvent extends BaseEntity {
  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId: string | null;

  @Column({ type: 'varchar' })
  module: string;

  @Column({ name: 'entity_type', type: 'varchar' })
  entityType: string;

  @Column({ name: 'entity_id', type: 'varchar', nullable: true })
  entityId: string | null;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  before: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  after: Record<string, unknown> | null;

  @Column({ type: 'varchar', nullable: true })
  ip: string | null;

  @Column({ type: 'timestamptz' })
  at: Date;

  @Column({ name: 'correlation_id', type: 'varchar', nullable: true })
  correlationId: string | null;
}
