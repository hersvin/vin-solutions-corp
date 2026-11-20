import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';

export enum ReviewCycleStatus {
  CONFIG = 'config',
  ACTIVE = 'active',
  FINALIZING = 'finalizing',
  CLOSED = 'closed',
}

@Entity('review_cycle')
export class ReviewCycle extends SoftDeletableEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: string;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: string;

  @Column({ type: 'varchar', default: ReviewCycleStatus.CONFIG })
  status: ReviewCycleStatus;

  @Column({ name: 'calibration_required', type: 'boolean', default: false })
  calibrationRequired: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  deadline: Date | null;
}
