import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { User } from './user.entity.js';

export enum ScopeType {
  COMPANY = 'company',
  DEPARTMENT = 'department',
  BRANCH = 'branch',
  TEAM = 'team',
}

@Entity('entity_scope')
export class EntityScope extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'scope_type', type: 'varchar', default: ScopeType.COMPANY })
  scopeType: ScopeType;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @Column({
    name: 'derived_grants',
    type: 'jsonb',
    nullable: true,
  })
  derivedGrants: Record<string, unknown> | null;
}
