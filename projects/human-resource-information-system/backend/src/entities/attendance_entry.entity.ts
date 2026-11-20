import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Employee } from './employee.entity.js';
import { Shift } from './shift.entity.js';

export enum AttendanceSource {
  WEB = 'web',
  MOBILE = 'mobile',
  DEVICE = 'device',
  IMPORT = 'import',
}

@Entity('attendance_entry')
export class AttendanceEntry extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId: string | null;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift | null;

  @Column({ name: 'clocked_in_at', type: 'timestamptz', nullable: true })
  clockedInAt: Date | null;

  @Column({ name: 'clocked_out_at', type: 'timestamptz', nullable: true })
  clockedOutAt: Date | null;

  @Column({ type: 'varchar', default: AttendanceSource.WEB })
  source: AttendanceSource;

  @Column({ name: 'is_original', type: 'boolean', default: true })
  isOriginal: boolean;

  @Column({ name: 'late_minutes', type: 'int', default: 0 })
  lateMinutes: number;

  @Column({ name: 'undertime_minutes', type: 'int', default: 0 })
  undertimeMinutes: number;

  @Column({ name: 'ot_hours', type: 'numeric', precision: 6, scale: 2, default: 0 })
  otHours: string;

  @Column({ name: 'absence_flag', type: 'boolean', default: false })
  absenceFlag: boolean;

  @Column({ name: 'break_minutes', type: 'int', default: 0 })
  breakMinutes: number;
}
