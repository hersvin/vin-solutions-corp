import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Candidate } from './candidate.entity.js';
import { JobRequisition } from './job_requisition.entity.js';

@Entity('application')
export class Application extends SoftDeletableEntity {
  @Column({ name: 'candidate_id', type: 'uuid' })
  candidateId: string;

  @ManyToOne(() => Candidate, { eager: true })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @Column({ name: 'requisition_id', type: 'uuid' })
  requisitionId: string;

  @ManyToOne(() => JobRequisition)
  @JoinColumn({ name: 'requisition_id' })
  requisition: JobRequisition;

  @Column({ type: 'varchar', nullable: true })
  stage: string | null;

  @Column({ name: 'submitted_at', type: 'timestamptz' })
  submittedAt: Date;

  @Column({ name: 'screening_result', type: 'jsonb', nullable: true })
  screeningResult: Record<string, unknown> | null;
}
