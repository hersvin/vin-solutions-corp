import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Task } from './task.entity.js';

@Entity('task_attachment')
export class TaskAttachment extends BaseEntity {
  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @ManyToOne(() => Task, { eager: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'storage_key', type: 'varchar' })
  storageKey: string;

  @Column({ type: 'varchar', nullable: true })
  mime: string | null;

  @Column({ type: 'bigint', default: 0n })
  size: bigint;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedBy: string | null;
}
