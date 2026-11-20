import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Document } from './document.entity.js';
import { User } from './user.entity.js';

@Entity('document_access_log')
export class DocumentAccessLog extends BaseEntity {
  @Column({ name: 'document_id', type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document, { eager: true })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar', nullable: true })
  ip: string | null;

  @Column({ type: 'timestamptz' })
  at: Date;
}
