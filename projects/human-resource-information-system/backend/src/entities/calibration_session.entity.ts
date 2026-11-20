import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { ReviewCycle } from './review_cycle.entity.js';

@Entity('calibration_session')
export class CalibrationSession extends BaseEntity {
  @Column({ name: 'review_cycle_id', type: 'uuid' })
  reviewCycleId: string;

  @ManyToOne(() => ReviewCycle, { eager: true })
  @JoinColumn({ name: 'review_cycle_id' })
  reviewCycle: ReviewCycle;

  @Column({ name: 'held_at', type: 'timestamptz' })
  heldAt: Date;

  @Column({ type: 'uuid', array: true })
  participants: string[];

  @Column({ type: 'jsonb', nullable: true })
  outcomes: Record<string, unknown> | null;
}
