import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { WorkSchedule } from './work_schedule.entity.js';

@Entity('shift')
export class Shift extends SoftDeletableEntity {
  @Column({ name: 'work_schedule_id', type: 'uuid', nullable: true })
  workScheduleId: string | null;

  @ManyToOne(() => WorkSchedule)
  @JoinColumn({ name: 'work_schedule_id' })
  workSchedule: WorkSchedule | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'starts_at', type: 'varchar', nullable: true })
  startsAt: string | null;

  @Column({ name: 'ends_at', type: 'varchar', nullable: true })
  endsAt: string | null;

  @Column({ name: 'is_overtime_cap', type: 'boolean', default: false })
  isOvertimeCap: boolean;

  @Column({ name: 'break_minutes', type: 'int', default: 0 })
  breakMinutes: number;
}
