import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'node:crypto';
import { DocumentVersion } from '../../entities/document_version.entity.js';
import { Document } from '../../entities/document.entity.js';
import { StorageService } from '../../core/storage/storage.service.js';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectRepository(DocumentVersion)
    private readonly versionRepo: Repository<DocumentVersion>,
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    private readonly storageService: StorageService,
  ) {}

  async uploadVersion(
    documentId: string,
    file: Buffer,
    contentType: string,
    uploadedBy?: string,
  ): Promise<DocumentVersion> {
    const document = await this.documentRepo.findOne({
      where: { id: documentId },
    });
    if (!document) throw new Error(`Document ${documentId} not found`);

    const versionNo = document.versionCount + 1;
    const fileHash = createHash('sha256').update(file).digest('hex');
    const storageKey = `documents/${documentId}/${versionNo}`;

    await this.storageService.upload(storageKey, file, contentType);

    const version = this.versionRepo.create({
      documentId,
      versionNo,
      fileStorageKey: storageKey,
      fileHash,
      sizeBytes: String(file.length),
      uploadedBy: uploadedBy ?? null,
      uploadedAt: new Date(),
      scanStatus: 'pending',
    });
    const saved = await this.versionRepo.save(version);

    document.versionCount = versionNo;
    await this.documentRepo.save(document);

    this.logger.debug(
      `document version uploaded: doc=${documentId} v${versionNo} hash=${fileHash}`,
    );
    return saved;
  }

  async getDownloadUrl(documentId: string): Promise<string> {
    const version = await this.versionRepo
      .createQueryBuilder('v')
      .where('v.document_id = :docId', { docId: documentId })
      .orderBy('v.version_no', 'DESC')
      .getOne();
    if (!version) throw new Error(`No versions for document ${documentId}`);
    return this.storageService.getSignedDownloadUrl(version.fileStorageKey);
  }
}
