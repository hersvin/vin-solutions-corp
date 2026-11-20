import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity.js';
import { Document } from './document.entity.js';

@Entity('document_version')
export class DocumentVersion extends BaseEntity {
  @Column({ name: 'document_id', type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document, { eager: true })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'version_no', type: 'int' })
  versionNo: number;

  @Column({ name: 'file_storage_key', type: 'varchar' })
  fileStorageKey: string;

  @Column({ name: 'file_hash', type: 'varchar', nullable: true })
  fileHash: string | null;

  @Column({ name: 'size_bytes', type: 'bigint', default: 0 })
  sizeBytes: string;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedBy: string | null;

  @Column({ name: 'uploaded_at', type: 'timestamptz' })
  uploadedAt: Date;

  @Column({ name: 'scan_status', type: 'varchar', default: 'pending' })
  scanStatus: string;
}
