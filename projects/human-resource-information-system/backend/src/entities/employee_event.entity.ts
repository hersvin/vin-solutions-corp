import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Employee } from './employee.entity.js';
import { User } from './user.entity.js';

export enum EmployeeEventType {
  ONBOARD = 'onboard',
  TRANSFER = 'transfer',
  PROMOTE = 'promote',
  SUSPEND = 'suspend',
  TERMINATE = 'terminate',
  REHIRE = 'rehire',
}

@Entity('employee_event')
export class EmployeeEvent extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', default: EmployeeEventType.ONBOARD })
  eventType: EmployeeEventType;

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;

  @Column({ name: 'initiated_by', type: 'uuid' })
  initiatedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiated_by' })
  initiatedByUser: User;
}
