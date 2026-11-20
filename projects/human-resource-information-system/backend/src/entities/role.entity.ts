import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity.js';

export enum RoleScope {
  SYSTEM = 'system',
  MODULE = 'module',
  RECORD = 'record',
  FIELD = 'field',
}

@Entity('role')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'varchar', default: RoleScope.MODULE })
  scope: RoleScope;
}
