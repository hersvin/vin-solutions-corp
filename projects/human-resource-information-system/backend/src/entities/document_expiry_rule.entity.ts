import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { DocumentCategory } from './document_category.entity.js';

@Entity('document_expiry_rule')
export class DocumentExpiryRule extends BaseEntity {
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => DocumentCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: DocumentCategory;

  @Column({ name: 'alert_days_before', type: 'int', default: 30 })
  alertDaysBefore: number;

  @Column({
    name: 'renewal_reminder_days',
    type: 'int',
    default: 14,
  })
  renewalReminderDays: number;
}
