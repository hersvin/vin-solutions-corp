import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { AssetCategory } from './asset_category.entity.js';

export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  DISPOSED = 'disposed',
}

@Entity('asset')
export class Asset extends SoftDeletableEntity {
  @Column({ name: 'tag_no', type: 'varchar', unique: true })
  tagNo: string;

  @Column({ name: 'serial_no', type: 'varchar', nullable: true })
  serialNo: string | null;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => AssetCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: AssetCategory;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: string | null;

  @Column({ name: 'purchase_cost', type: 'numeric', precision: 14, scale: 2, nullable: true })
  purchaseCost: string | null;

  @Column({ type: 'varchar', nullable: true })
  vendor: string | null;

  @Column({ name: 'warranty_until', type: 'date', nullable: true })
  warrantyUntil: string | null;

  @Column({ name: 'condition_code', type: 'varchar', nullable: true })
  conditionCode: string | null;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId: string | null;

  @Column({ type: 'varchar', default: AssetStatus.AVAILABLE })
  status: AssetStatus;
}
