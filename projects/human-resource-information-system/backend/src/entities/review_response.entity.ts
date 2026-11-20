import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Review } from './review.entity.js';

@Entity('review_response')
export class ReviewResponse extends BaseEntity {
  @Column({ name: 'review_id', type: 'uuid' })
  reviewId: string;

  @ManyToOne(() => Review, { eager: true })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column({ name: 'participant_id', type: 'uuid', nullable: true })
  participantId: string | null;

  @Column({ type: 'jsonb' })
  answers: Record<string, unknown>;

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @Column({ name: 'evidence_refs', type: 'uuid', array: true, default: '{}' })
  evidenceRefs: string[];

  @Column({ name: 'submitted_at', type: 'timestamptz' })
  submittedAt: Date;
}
