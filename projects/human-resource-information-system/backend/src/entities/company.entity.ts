import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { LegalEntity } from './legal_entity.entity.js';

@Entity('company')
export class Company extends SoftDeletableEntity {
  @Column({ name: 'legal_entity_id', type: 'uuid', nullable: true })
  legalEntityId: string | null;

  @ManyToOne(() => LegalEntity)
  @JoinColumn({ name: 'legal_entity_id' })
  legalEntity: LegalEntity | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'short_code', type: 'varchar', nullable: true })
  shortCode: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
