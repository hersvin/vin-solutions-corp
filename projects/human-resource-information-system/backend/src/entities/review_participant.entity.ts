import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { ReviewCycle } from './review_cycle.entity.js';
import { Employee } from './employee.entity.js';

export enum RaterRole {
  SELF = 'self',
  MANAGER = 'manager',
  PEER = 'peer',
  HR = 'hr',
}

@Entity('review_participant')
export class ReviewParticipant extends BaseEntity {
  @Column({ name: 'review_cycle_id', type: 'uuid' })
  reviewCycleId: string;

  @ManyToOne(() => ReviewCycle, { eager: true })
  @JoinColumn({ name: 'review_cycle_id' })
  reviewCycle: ReviewCycle;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'rater_role', type: 'varchar' })
  raterRole: RaterRole;

  @Column({ name: 'assigned_at', type: 'timestamptz' })
  assignedAt: Date;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date | null;
}
