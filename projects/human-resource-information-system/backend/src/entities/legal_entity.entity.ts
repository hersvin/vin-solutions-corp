import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('legal_entity')
export class LegalEntity extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'tax_id', type: 'varchar', nullable: true })
  taxId: string | null;

  @Column({ name: 'registry_no', type: 'varchar', nullable: true })
  registryNo: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
