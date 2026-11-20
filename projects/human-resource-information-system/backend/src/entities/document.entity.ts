import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeletableEntity } from './soft-deletable.entity.js';
import { User } from './user.entity.js';
import { Employee } from './employee.entity.js';
import { DocumentCategory } from './document_category.entity.js';

export enum DocumentAccessLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

export enum DocumentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  UNDER_HOLD = 'under_hold',
  DISPOSED = 'disposed',
}

@Entity('document')
export class Document extends SoftDeletableEntity {
  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser: User;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId: string | null;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => DocumentCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: DocumentCategory;

  @Column({ type: 'varchar' })
  title: string;

  @Column({
    name: 'access_level',
    type: 'varchar',
    default: DocumentAccessLevel.INTERNAL,
  })
  accessLevel: DocumentAccessLevel;

  @Column({ type: 'varchar', default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Column({ name: 'version_count', type: 'int', default: 0 })
  versionCount: number;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate: Date | null;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date | null;

  @Column({ name: 'retention_until', type: 'date', nullable: true })
  retentionUntil: Date | null;

  @Column({ name: 'legal_hold_flag', type: 'boolean', default: false })
  legalHoldFlag: boolean;
}
