import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { JobRequisition } from './job_requisition.entity.js';

export enum CandidateStatus {
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('candidate')
export class Candidate extends SoftDeletableEntity {
  @Column({ name: 'requisition_id', type: 'uuid' })
  requisitionId: string;

  @ManyToOne(() => JobRequisition, { eager: true })
  @JoinColumn({ name: 'requisition_id' })
  requisition: JobRequisition;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ name: 'consent_at', type: 'timestamptz', nullable: true })
  consentAt: Date | null;

  @Column({ name: 'consent_ref', type: 'varchar', nullable: true })
  consentRef: string | null;

  @Column({ name: 'retention_until', type: 'date', nullable: true })
  retentionUntil: Date | null;

  @Column({ type: 'varchar', default: CandidateStatus.SCREENING })
  status: CandidateStatus;

  @Column({ name: 'source_channel', type: 'varchar', nullable: true })
  sourceChannel: string | null;
}
