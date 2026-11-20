import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { PayrollRunItem } from './payroll_run_item.entity.js';

@Entity('payslip')
export class Payslip extends BaseEntity {
  @Column({ name: 'payroll_run_item_id', type: 'uuid' })
  payrollRunItemId: string;

  @ManyToOne(() => PayrollRunItem, { eager: true })
  @JoinColumn({ name: 'payroll_run_item_id' })
  payrollRunItem: PayrollRunItem;

  @Column({ name: 'pdf_storage_key', type: 'varchar', nullable: true })
  pdfStorageKey: string | null;

  @Column({ name: 'issued_at', type: 'timestamptz', nullable: true })
  issuedAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt: Date | null;
}
