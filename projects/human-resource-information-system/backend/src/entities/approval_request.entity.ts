import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { User } from './user.entity.js';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('approval_request')
export class ApprovalRequest extends SoftDeletableEntity {
  @Column({ name: 'requester_user_id', type: 'uuid' })
  requesterUserId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'requester_user_id' })
  requester: User;

  @Column({ name: 'approver_user_id', type: 'uuid' })
  approverUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_user_id' })
  approver: User;

  @Column({ type: 'varchar' })
  module: string;

  @Column({ name: 'entity_type', type: 'varchar' })
  entityType: string;

  @Column({ name: 'entity_id', type: 'varchar' })
  entityId: string;

  @Column({ type: 'varchar', default: ApprovalStatus.PENDING })
  status: ApprovalStatus;

  @Column({ name: 'decided_at', type: 'timestamptz', nullable: true })
  decidedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;
}
