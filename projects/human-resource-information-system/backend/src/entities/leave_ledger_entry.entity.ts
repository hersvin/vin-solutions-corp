import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('leave_ledger_entry')
export class LeaveLedgerEntry extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'leave_type_id', type: 'uuid' })
  leaveTypeId: string;

  @Column({ name: 'request_id', type: 'uuid' })
  requestId: string;

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: Date;

  @Column({ name: 'delta_days', type: 'numeric', precision: 10, scale: 2 })
  deltaDays: string;

  @Column({ name: 'balance_after', type: 'numeric', precision: 10, scale: 2 })
  balanceAfter: string;

  @Column({ name: 'posted_at', type: 'timestamptz' })
  postedAt: Date;
}
