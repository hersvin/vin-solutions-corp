import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('rating_scale')
export class RatingScale extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'jsonb' })
  levels: Record<string, unknown>;
}
