import { DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity.js';

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
