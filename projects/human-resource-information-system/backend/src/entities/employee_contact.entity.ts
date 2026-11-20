import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Employee } from './employee.entity.js';

export enum ContactType {
  PERSONAL = 'personal',
  OFFICE = 'office',
  MOBILE = 'mobile',
}

@Entity('employee_contact')
export class EmployeeContact extends SoftDeletableEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', default: ContactType.PERSONAL })
  type: ContactType;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'valid_from', type: 'date', nullable: true })
  validFrom: Date | null;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo: Date | null;
}
