import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';
import { Position } from './position.entity.js';
import { User } from './user.entity.js';

export enum RequisitionStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  FILLED = 'filled',
  CANCELED = 'canceled',
}

@Entity('job_requisition')
export class JobRequisition extends SoftDeletableEntity {
  @Column({ name: 'position_id', type: 'uuid', nullable: true })
  positionId: string | null;

  @ManyToOne(() => Position)
  @JoinColumn({ name: 'position_id' })
  position: Position | null;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'hiring_manager_user_id', type: 'uuid', nullable: true })
  hiringManagerUserId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'hiring_manager_user_id' })
  hiringManager: User | null;

  @Column({ type: 'int', default: 1 })
  headcount: number;

  @Column({ name: 'budget_ref', type: 'varchar', nullable: true })
  budgetRef: string | null;

  @Column({ type: 'varchar', default: RequisitionStatus.DRAFT })
  status: RequisitionStatus;

  @Column({ name: 'opened_at', type: 'timestamptz', nullable: true })
  openedAt: Date | null;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date | null;
}
