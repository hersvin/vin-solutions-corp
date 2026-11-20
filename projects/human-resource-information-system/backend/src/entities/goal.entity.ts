import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('goal')
export class Goal extends SoftDeletableEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'review_id', type: 'uuid', nullable: true })
  reviewId: string | null;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: string | null;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ name: 'progress_pct', type: 'int', default: 0 })
  progressPct: number;

  @Column({ type: 'jsonb', nullable: true })
  milestones: Record<string, unknown> | null;
}
