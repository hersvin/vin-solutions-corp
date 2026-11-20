import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Document } from './document.entity.js';
import { User } from './user.entity.js';

@Entity('document_disposal')
export class DocumentDisposal extends BaseEntity {
  @Column({ name: 'document_id', type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document, { eager: true })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'authorized_by', type: 'uuid' })
  authorizedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorized_by' })
  authorizedByUser: User;

  @Column({ name: 'disposed_at', type: 'timestamptz' })
  disposedAt: Date;
}
