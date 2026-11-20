import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Department } from './department.entity.js';

@Entity('team')
export class Team extends SoftDeletableEntity {
  @Column({ name: 'department_id', type: 'uuid' })
  departmentId: string;

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'manager_user_id', type: 'uuid', nullable: true })
  managerUserId: string | null;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: Date;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo: Date | null;
}
