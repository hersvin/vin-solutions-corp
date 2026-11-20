import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('asset_maintenance')
export class AssetMaintenance extends BaseEntity {
  @Column({ name: 'asset_id', type: 'uuid' })
  assetId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  cost: string | null;

  @Column({ type: 'varchar', nullable: true })
  vendor: string | null;

  @Column({ name: 'next_due', type: 'date', nullable: true })
  nextDue: string | null;
}
