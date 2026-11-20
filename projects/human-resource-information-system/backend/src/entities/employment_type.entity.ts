import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('employment_type')
export class EmploymentType extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;
}
