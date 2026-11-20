import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { AttendanceEntry } from './attendance_entry.entity.js';

@Entity('attendance_adjustment')
export class AttendanceAdjustment extends BaseEntity {
  @Column({ name: 'attendance_entry_id', type: 'uuid' })
  attendanceEntryId: string;

  @ManyToOne(() => AttendanceEntry, { eager: true })
  @JoinColumn({ name: 'attendance_entry_id' })
  attendanceEntry: AttendanceEntry;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'applied_by', type: 'uuid', nullable: true })
  appliedBy: string | null;

  @Column({ name: 'approval_status', type: 'varchar', default: 'pending' })
  approvalStatus: string;

  @Column({ name: 'applied_at', type: 'timestamptz', nullable: true })
  appliedAt: Date | null;
}
