import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';

@Entity('pay_group')
export class PayGroup extends SoftDeletableEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ name: 'pay_period_type', type: 'varchar' })
  payPeriodType: string;

  @Column({ name: 'next_run_date', type: 'date', nullable: true })
  nextRunDate: Date | null;
}
