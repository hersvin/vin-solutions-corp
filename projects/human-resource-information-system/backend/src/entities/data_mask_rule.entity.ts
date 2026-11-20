import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity.js';

export enum MaskType {
  CODE = 'code',
  HASH = 'hash',
  FULL = 'full',
}

@Entity('data_mask_rule')
export class DataMaskRule extends BaseEntity {
  @Column({ name: 'field_name', type: 'varchar' })
  fieldName: string;

  @Column({ type: 'uuid', array: true, default: [] })
  roles: string[];

  @Column({ type: 'varchar', default: MaskType.CODE })
  maskType: MaskType;
}
