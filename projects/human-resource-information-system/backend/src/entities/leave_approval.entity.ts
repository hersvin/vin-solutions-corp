import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { LeaveRequest } from './leave_request.entity.js';
import { User } from './user.entity.js';

export enum LeaveDecision {
  APPROVE = 'approve',
  REJECT = 'reject',
}

@Entity('leave_approval')
export class LeaveApproval extends BaseEntity {
  @Column({ name: 'request_id', type: 'uuid' })
  requestId: string;

  @ManyToOne(() => LeaveRequest, { eager: true })
  @JoinColumn({ name: 'request_id' })
  request: LeaveRequest;

  @Column({ name: 'approver_user_id', type: 'uuid' })
  approverUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_user_id' })
  approver: User;

  @Column({ name: 'role_at_decision', type: 'varchar' })
  roleAtDecision: string;

  @Column({ type: 'varchar' })
  decision: LeaveDecision;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ name: 'decided_at', type: 'timestamptz' })
  decidedAt: Date;
}
