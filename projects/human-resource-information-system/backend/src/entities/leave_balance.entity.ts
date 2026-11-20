import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Employee } from './employee.entity.js';
import { LeaveType } from './leave_type.entity.js';

@Entity('leave_balance')
export class LeaveBalance extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'leave_type_id', type: 'uuid' })
  leaveTypeId: string;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;

  @Column({ type: 'varchar' })
  period: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  accrued: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  used: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  carryover: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  available: string;
}
