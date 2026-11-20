import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('milestone')
export class Milestone extends SoftDeletableEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'varchar', default: 'open' })
  status: string;

  @Column({ name: 'progress_pct', type: 'int', default: 0 })
  progressPct: number;
}
