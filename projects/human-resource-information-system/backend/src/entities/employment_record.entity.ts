import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AuditableEntity } from './auditable.entity.js';
import { Employee } from './employee.entity.js';
import { Company } from './company.entity.js';
import { Branch } from './branch.entity.js';
import { Location } from './location.entity.js';
import { Department } from './department.entity.js';
import { Team } from './team.entity.js';
import { Position } from './position.entity.js';
import { CostCenter } from './cost_center.entity.js';
import { EmploymentType } from './employment_type.entity.js';

export enum EmploymentStatus {
  ACTIVE = 'active',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
}

@Entity('employment_record')
@Index('idx_emp_record_employee_valid_from', ['employeeId', 'startDate'])
export class EmploymentRecord extends AuditableEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'branch_id', type: 'uuid', nullable: true })
  branchId: string | null;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch | null;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string | null;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location | null;

  @Column({ name: 'department_id', type: 'uuid', nullable: true })
  departmentId: string | null;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @Column({ name: 'team_id', type: 'uuid', nullable: true })
  teamId: string | null;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team | null;

  @Column({ name: 'position_id', type: 'uuid', nullable: true })
  positionId: string | null;

  @ManyToOne(() => Position)
  @JoinColumn({ name: 'position_id' })
  position: Position | null;

  @Column({ name: 'manager_user_id', type: 'uuid', nullable: true })
  managerUserId: string | null;

  @Column({ name: 'employment_type_id', type: 'uuid', nullable: true })
  employmentTypeId: string | null;

  @ManyToOne(() => EmploymentType)
  @JoinColumn({ name: 'employment_type_id' })
  employmentType: EmploymentType | null;

  @Column({ name: 'cost_center_id', type: 'uuid', nullable: true })
  costCenterId: string | null;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  costCenter: CostCenter | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'varchar', default: EmploymentStatus.ACTIVE })
  employmentStatus: EmploymentStatus;

  @Column({ name: 'termination_reason_code', type: 'varchar', nullable: true })
  terminationReasonCode: string | null;
}
