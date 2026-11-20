import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AuditableEntity } from './auditable.entity.js';
import { EmploymentRecord } from './employment_record.entity.js';

@Entity('compensation_record')
export class CompensationRecord extends AuditableEntity {
  @Column({ name: 'employment_record_id', type: 'uuid' })
  employmentRecordId: string;

  @ManyToOne(() => EmploymentRecord, { eager: true })
  @JoinColumn({ name: 'employment_record_id' })
  employmentRecord: EmploymentRecord;

  @Column({ name: 'pay_group_id', type: 'uuid', nullable: true })
  payGroupId: string | null;

  @Column({ name: 'base_salary', type: 'numeric', precision: 14, scale: 2, nullable: true })
  baseSalary: number | null;

  @Column({ type: 'varchar', nullable: true })
  currency: string | null;

  @Column({ name: 'pay_frequency', type: 'varchar', nullable: true })
  payFrequency: string | null;

  @Column({ name: 'effective_date', type: 'date' })
  effectiveDate: Date;

  @Column({ name: 'is_confidential', type: 'boolean', default: true })
  isConfidential: boolean;
}
