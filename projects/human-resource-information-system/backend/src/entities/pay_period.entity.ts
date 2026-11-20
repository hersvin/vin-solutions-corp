import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { PayGroup } from './pay_group.entity.js';

export enum PayPeriodStatus {
  OPEN = 'open',
  PREVIEW = 'preview',
  APPROVED = 'approved',
  LOCKED = 'locked',
  PAID = 'paid',
}

export enum PayPeriodType {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  SEMIMONTHLY = 'semimonthly',
  MONTHLY = 'monthly',
}

@Entity('pay_period')
export class PayPeriod extends SoftDeletableEntity {
  @Column({ name: 'pay_group_id', type: 'uuid' })
  payGroupId: string;

  @ManyToOne(() => PayGroup, { eager: true })
  @JoinColumn({ name: 'pay_group_id' })
  payGroup: PayGroup;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', default: PayPeriodStatus.OPEN })
  status: PayPeriodStatus;

  @Column({ name: 'approval_user_id', type: 'uuid', nullable: true })
  approvalUserId: string | null;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date | null;
}
