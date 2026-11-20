import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Task } from './task.entity.js';

export enum DependencyType {
  FINISH_START = 'finish_start',
  FINISH_FINISH = 'finish_finish',
  START_START = 'start_start',
}

@Entity('task_dependency')
export class TaskDependency extends BaseEntity {
  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @ManyToOne(() => Task, { eager: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'depends_on_task_id', type: 'uuid' })
  dependsOnTaskId: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'depends_on_task_id' })
  dependsOnTask: Task;

  @Column({ type: 'varchar', default: DependencyType.FINISH_START })
  type: DependencyType;
}
