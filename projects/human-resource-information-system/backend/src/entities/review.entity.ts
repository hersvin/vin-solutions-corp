import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

export enum ReviewStatus {
  PENDING = 'pending',
  SELF_DONE = 'self_done',
  MANAGER_DONE = 'manager_done',
  PEER_DONE = 'peer_done',
  CALIBRATED = 'calibrated',
  FINALIZED = 'finalized',
}

@Entity('review')
export class Review extends BaseEntity {
  @Column({ name: 'review_cycle_id', type: 'uuid' })
  reviewCycleId: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'template_id', type: 'uuid', nullable: true })
  templateId: string | null;

  @Column({ type: 'varchar', default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Column({ name: 'final_rating_code', type: 'varchar', nullable: true })
  finalRatingCode: string | null;

  @Column({ name: 'finalized_by', type: 'uuid', nullable: true })
  finalizedBy: string | null;

  @Column({ name: 'finalized_at', type: 'timestamptz', nullable: true })
  finalizedAt: Date | null;
}
