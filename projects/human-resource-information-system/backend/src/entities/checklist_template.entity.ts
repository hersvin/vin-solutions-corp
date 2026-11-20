import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { ChecklistItem } from './checklist_item.entity.js';

@Entity('checklist_template')
export class ChecklistTemplate extends SoftDeletableEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  category: string | null;

  @OneToMany(() => ChecklistItem, (item) => item.template)
  items: ChecklistItem[];
}
