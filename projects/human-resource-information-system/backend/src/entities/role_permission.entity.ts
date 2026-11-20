import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Role } from './role.entity.js';

export enum RoleAction {
  READ = 'read',
  WRITE = 'write',
  APPROVE = 'approve',
  DELETE = 'delete',
  EXPORT = 'export',
}

@Entity('role_permission')
export class RolePermission extends BaseEntity {
  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'resource_code', type: 'varchar' })
  resourceCode: string;

  @Column({ type: 'varchar', default: RoleAction.READ })
  action: RoleAction;

  @Column({
    name: 'field_mask',
    type: 'jsonb',
    nullable: true,
  })
  fieldMask: Record<string, string> | null;
}
