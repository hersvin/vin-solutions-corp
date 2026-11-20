import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';
import { User } from './user.entity.js';

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum ProjectVisibility {
  PRIVATE = 'private',
  PROJECT = 'project',
  COMPANY = 'company',
}

@Entity('project')
export class Project extends SoftDeletableEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'workspace_id', type: 'uuid', nullable: true })
  workspaceId: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  code: string | null;

  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser: User;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: string | null;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'varchar', default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column({ type: 'varchar', default: ProjectVisibility.PROJECT })
  visibility: ProjectVisibility;

  @Column({ name: 'budget_ref', type: 'varchar', nullable: true })
  budgetRef: string | null;
}
