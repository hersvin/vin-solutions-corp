import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('role_group')
export class RoleGroup extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}

@Entity('group_member')
export class GroupMember extends BaseEntity {
  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @ManyToOne(() => RoleGroup, { eager: true })
  @JoinColumn({ name: 'group_id' })
  group: RoleGroup;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;
}
