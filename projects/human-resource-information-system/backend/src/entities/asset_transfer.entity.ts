import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('asset_transfer')
export class AssetTransfer extends BaseEntity {
  @Column({ name: 'asset_id', type: 'uuid' })
  assetId: string;

  @Column({ name: 'from_location', type: 'uuid', nullable: true })
  fromLocation: string | null;

  @Column({ name: 'to_location', type: 'uuid', nullable: true })
  toLocation: string | null;

  @Column({ name: 'moved_at', type: 'timestamptz' })
  movedAt: Date;

  @Column({ name: 'moved_by', type: 'uuid', nullable: true })
  movedBy: string | null;
}
