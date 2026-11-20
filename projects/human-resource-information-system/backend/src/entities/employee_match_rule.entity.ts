import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('employee_match_rule')
export class EmployeeMatchRule extends BaseEntity {
  @Column({ type: 'varchar' })
  field: string;

  @Column({ type: 'varchar', nullable: true })
  operator: string | null;

  @Column({ type: 'float4', nullable: true })
  threshold: number | null;
}
