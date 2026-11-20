import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Application } from './application.entity.js';

@Entity('interview')
export class Interview extends SoftDeletableEntity {
  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => Application, { eager: true })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'int' })
  round: number;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ name: 'interviewers', type: 'uuid', array: true })
  interviewers: string[];

  @Column({ type: 'jsonb', nullable: true })
  feedback: Record<string, unknown> | null;

  @Column({ type: 'varchar', nullable: true })
  outcome: string | null;
}
