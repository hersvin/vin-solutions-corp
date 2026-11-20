import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Task } from './task.entity.js';

@Entity('task_activity')
export class TaskActivity extends BaseEntity {
  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @ManyToOne(() => Task, { eager: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId: string | null;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'timestamptz' })
  at: Date;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;
}
