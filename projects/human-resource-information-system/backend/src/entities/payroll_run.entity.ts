import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { PayPeriod } from './pay_period.entity.js';

export enum PayrollRunStatus {
  OPEN = 'open',
  PREVIEW = 'preview',
  APPROVED = 'approved',
  LOCKED = 'locked',
  PAID = 'paid',
}

@Entity('payroll_run')
export class PayrollRun extends SoftDeletableEntity {
  @Column({ name: 'pay_period_id', type: 'uuid' })
  payPeriodId: string;

  @ManyToOne(() => PayPeriod, { eager: true })
  @JoinColumn({ name: 'pay_period_id' })
  payPeriod: PayPeriod;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'varchar', default: PayrollRunStatus.OPEN })
  status: PayrollRunStatus;

  @Column({ name: 'prepared_by', type: 'uuid', nullable: true })
  preparedBy: string | null;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy: string | null;

  @Column({ name: 'locked_at', type: 'timestamptz', nullable: true })
  lockedAt: Date | null;
}
