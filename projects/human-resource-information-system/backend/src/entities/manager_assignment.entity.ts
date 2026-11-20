import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Position } from './position.entity.js';
import { User } from './user.entity.js';

@Entity('manager_assignment')
export class ManagerAssignment extends BaseEntity {
  @Column({ name: 'position_id', type: 'uuid' })
  positionId: string;

  @ManyToOne(() => Position, { eager: true })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ name: 'manager_user_id', type: 'uuid' })
  managerUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_user_id' })
  managerUser: User;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: Date;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo: Date | null;
}
