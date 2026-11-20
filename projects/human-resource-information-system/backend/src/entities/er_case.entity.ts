import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Employee } from './employee.entity.js';

export enum ErCaseStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

@Entity('er_case')
export class ErCase extends SoftDeletableEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', nullable: true })
  category: string | null;

  @Column({ type: 'varchar', default: ErCaseStatus.OPEN })
  status: ErCaseStatus;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'opened_by', type: 'uuid', nullable: true })
  openedBy: string | null;

  @Column({
    name: 'access_grant_user_ids',
    type: 'uuid',
    array: true,
    default: [],
  })
  accessGrantUserIds: string[];
}
