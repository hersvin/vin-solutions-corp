import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

export enum WorkLocationTypeCode {
  OFFICE = 'office',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

@Entity('work_location_type')
export class WorkLocationType extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;
}
