import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Location } from './location.entity.js';

@Entity('work_schedule')
export class WorkSchedule extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string | null;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location | null;

  @Column({ name: 'starts_at', type: 'varchar', nullable: true })
  startsAt: string | null;

  @Column({ name: 'ends_at', type: 'varchar', nullable: true })
  endsAt: string | null;

  @Column({ name: 'days_of_week', type: 'varchar', nullable: true })
  daysOfWeek: string | null;

  @Column({ name: 'grace_minutes', type: 'int', default: 0 })
  graceMinutes: number;

  @Column({ name: 'valid_from', type: 'date', nullable: true })
  validFrom: Date | null;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo: Date | null;
}
