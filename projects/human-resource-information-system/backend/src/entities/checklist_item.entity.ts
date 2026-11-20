import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { ChecklistTemplate } from './checklist_template.entity.js';

@Entity('checklist_item')
export class ChecklistItem extends SoftDeletableEntity {
  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @ManyToOne(() => ChecklistTemplate, (t) => t.items, { eager: true })
  @JoinColumn({ name: 'template_id' })
  template: ChecklistTemplate;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
