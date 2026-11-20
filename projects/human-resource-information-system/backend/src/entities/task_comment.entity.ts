import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Task } from './task.entity.js';

@Entity('task_comment')
export class TaskComment extends BaseEntity {
  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @ManyToOne(() => Task, { eager: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'author_user_id', type: 'uuid', nullable: true })
  authorUserId: string | null;

  @Column({ type: 'text' })
  body: string;
}
