import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { Branch } from './branch.entity.js';

@Entity('location')
export class Location extends SoftDeletableEntity {
  @Column({ name: 'branch_id', type: 'uuid', nullable: true })
  branchId: string | null;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ name: 'geo_lat', type: 'float8', nullable: true })
  geoLat: number | null;

  @Column({ name: 'geo_lon', type: 'float8', nullable: true })
  geoLon: number | null;

  @Column({ name: 'tz_name', type: 'varchar', nullable: true })
  tzName: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
