import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Employee } from './employee.entity.js';
import { LeaveType } from './leave_type.entity.js';

export enum LeaveRequestStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  MANAGER_REVIEW = 'manager_review',
  HR_REVIEW = 'hr_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}

@Entity('leave_request')
export class LeaveRequest extends SoftDeletableEntity {
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

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  hours: string | null;

  @Column({ type: 'varchar', default: LeaveRequestStatus.DRAFT })
  status: LeaveRequestStatus;

  @Column({ name: 'doc_requirements', type: 'jsonb', nullable: true })
  docRequirements: Record<string, unknown> | null;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date | null;

  @Column({ name: 'decided_at', type: 'timestamptz', nullable: true })
  decidedAt: Date | null;
}
