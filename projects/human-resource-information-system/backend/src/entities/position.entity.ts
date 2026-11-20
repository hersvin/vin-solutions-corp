import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Company } from './company.entity.js';
import { Department } from './department.entity.js';
import { JobLevel } from './job_level.entity.js';
import { EmploymentType } from './employment_type.entity.js';

@Entity('position')
export class Position extends SoftDeletableEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'department_id', type: 'uuid', nullable: true })
  departmentId: string | null;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @Column({ name: 'job_level_id', type: 'uuid', nullable: true })
  jobLevelId: string | null;

  @ManyToOne(() => JobLevel)
  @JoinColumn({ name: 'job_level_id' })
  jobLevel: JobLevel | null;

  @Column({ name: 'employment_type_id', type: 'uuid', nullable: true })
  employmentTypeId: string | null;

  @ManyToOne(() => EmploymentType)
  @JoinColumn({ name: 'employment_type_id' })
  employmentType: EmploymentType | null;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  code: string | null;

  @Column({ name: 'reports_to_position_id', type: 'uuid', nullable: true })
  reportsToPositionId: string | null;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: Date;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo: Date | null;
}
