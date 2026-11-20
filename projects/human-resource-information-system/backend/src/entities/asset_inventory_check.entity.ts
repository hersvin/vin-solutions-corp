import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('asset_inventory_check')
export class AssetInventoryCheck extends BaseEntity {
  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string | null;

  @Column({ name: 'checked_at', type: 'timestamptz' })
  checkedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  results: Record<string, unknown> | null;

  @Column({ name: 'discrepancies', type: 'uuid', array: true, default: '{}' })
  discrepancies: string[];
}
