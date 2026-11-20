import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';

@Entity('leave_type')
export class LeaveType extends SoftDeletableEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'is_paid', type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ name: 'accrual_rule', type: 'jsonb', nullable: true })
  accrualRule: Record<string, unknown> | null;

  @Column({ name: 'carryover_rule', type: 'jsonb', nullable: true })
  carryoverRule: Record<string, unknown> | null;

  @Column({ name: 'requires_documents', type: 'boolean', default: false })
  requiresDocuments: boolean;

  @Column({ name: 'requires_hr_review', type: 'boolean', default: false })
  requiresHrReview: boolean;
}
