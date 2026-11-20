import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('document_category')
export class DocumentCategory extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'retention_years', type: 'int', nullable: true })
  retentionYears: number | null;

  @Column({
    name: 'default_access_level',
    type: 'varchar',
    nullable: true,
  })
  defaultAccessLevel: string | null;
}
