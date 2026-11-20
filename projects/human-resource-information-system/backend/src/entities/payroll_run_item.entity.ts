import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { PayrollRun } from './payroll_run.entity.js';
import { Employee } from './employee.entity.js';

@Entity('payroll_run_item')
export class PayrollRunItem extends BaseEntity {
  @Column({ name: 'payroll_run_id', type: 'uuid' })
  payrollRunId: string;

  @ManyToOne(() => PayrollRun, { eager: true })
  @JoinColumn({ name: 'payroll_run_id' })
  payrollRun: PayrollRun;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'component_id', type: 'uuid', nullable: true })
  componentId: string | null;

  @Column({ type: 'float8', default: 0 })
  qty: number;

  @Column({ type: 'float8', default: 0 })
  rate: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  amount: string;

  @Column({ name: 'is_adjustment', type: 'boolean', default: false })
  isAdjustment: boolean;

  @Column({
    name: 'source_ref',
    type: 'jsonb',
    nullable: true,
  })
  sourceRef: Record<string, unknown> | null;
}
