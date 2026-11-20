import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Company } from './company.entity.js';

@Entity('org_chart_snapshot')
export class OrgChartSnapshot extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'taken_at', type: 'timestamptz' })
  takenAt: Date;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;
}
