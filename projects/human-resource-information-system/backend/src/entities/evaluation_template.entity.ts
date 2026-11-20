import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('evaluation_template')
export class EvaluationTemplate extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'rating_scale_id', type: 'uuid', nullable: true })
  ratingScaleId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  competencies: Record<string, unknown> | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
