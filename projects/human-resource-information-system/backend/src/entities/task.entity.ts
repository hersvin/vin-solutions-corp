import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

export enum TaskPriority {
  LOW = 'low',
  MED = 'med',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  DONE = 'done',
}

@Entity('task')
export class Task extends SoftDeletableEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'milestone_id', type: 'uuid', nullable: true })
  milestoneId: string | null;

  @Column({ name: 'parent_task_id', type: 'uuid', nullable: true })
  parentTaskId: string | null;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'owner_user_id', type: 'uuid', nullable: true })
  ownerUserId: string | null;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'varchar', default: TaskPriority.LOW })
  priority: TaskPriority;

  @Column({ type: 'varchar', default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ name: 'progress_pct', type: 'int', default: 0 })
  progressPct: number;
}
