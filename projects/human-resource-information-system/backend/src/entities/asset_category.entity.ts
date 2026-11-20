import { Column, Entity } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';

@Entity('asset_category')
export class AssetCategory extends SoftDeletableEntity {
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'im_catalog_ref', type: 'varchar', nullable: true })
  imCatalogRef: string | null;
}
