import { Column } from 'typeorm';
import { BaseEntity } from './base.entity.js';

export abstract class AuditableEntity extends BaseEntity {
  @Column({ name: 'changed_by', type: 'uuid', nullable: true })
  changedBy: string | null;

  @Column({ name: 'changed_at', type: 'timestamptz', nullable: true })
  changedAt: Date | null;
}
