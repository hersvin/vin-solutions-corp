import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';

export enum SalaryComponentType {
  EARNINGS = 'earnings',
  DEDUCTION = 'deduction',
  ALLOWANCE = 'allowance',
}

@Entity('salary_component')
export class SalaryComponent extends SoftDeletableEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', default: SalaryComponentType.EARNINGS })
  type: SalaryComponentType;

  @Column({ type: 'boolean', default: false })
  taxable: boolean;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({
    name: 'calculation_rule',
    type: 'jsonb',
    nullable: true,
  })
  calculationRule: Record<string, unknown> | null;
}
