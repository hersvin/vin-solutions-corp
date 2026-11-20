import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { User } from './user.entity.js';

export enum EmployeeStatus {
  PREBOARD = 'preboard',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  SEPARATED = 'separated',
}

@Entity('employee')
export class Employee extends SoftDeletableEntity {
  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'emp_no', type: 'varchar', unique: true })
  empNo: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', nullable: true })
  middleName: string | null;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ name: 'gender_code', type: 'varchar', nullable: true })
  genderCode: string | null;

  @Column({ name: 'nationality', type: 'varchar', nullable: true })
  nationality: string | null;

  @Column({ name: 'gov_id_masked', type: 'varchar', nullable: true })
  govIdMasked: string | null;

  @Column({ name: 'emergency_contact', type: 'jsonb', nullable: true })
  emergencyContact: Record<string, unknown> | null;

  @Column({ type: 'varchar', default: EmployeeStatus.PREBOARD })
  status: EmployeeStatus;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate: Date | null;

  @Column({ name: 'exit_date', type: 'date', nullable: true })
  exitDate: Date | null;

  @Column({ name: 'photo_storage_key', type: 'varchar', nullable: true })
  photoStorageKey: string | null;
}
