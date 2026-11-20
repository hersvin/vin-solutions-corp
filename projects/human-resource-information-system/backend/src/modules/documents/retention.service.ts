import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../entities/document.entity.js';
import { DocumentStatus } from '../../entities/document.entity.js';
import { DocumentDisposal } from '../../entities/document_disposal.entity.js';

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(DocumentDisposal)
    private readonly disposalRepo: Repository<DocumentDisposal>,
  ) {}

  async placeHold(documentId: string): Promise<Document> {
    const doc = await this.documentRepo.findOne({ where: { id: documentId } });
    if (!doc) throw new NotFoundException(`Document ${documentId} not found`);
    doc.status = DocumentStatus.UNDER_HOLD;
    doc.legalHoldFlag = true;
    return this.documentRepo.save(doc);
  }

  async dispose(
    documentId: string,
    reason: string,
    authorizedBy: string,
  ): Promise<DocumentDisposal> {
    const doc = await this.documentRepo.findOne({ where: { id: documentId } });
    if (!doc) throw new NotFoundException(`Document ${documentId} not found`);
    if (doc.legalHoldFlag) {
      throw new Error('Cannot dispose a document under legal hold');
    }
    doc.status = DocumentStatus.DISPOSED;
    await this.documentRepo.save(doc);

    const disposal = this.disposalRepo.create({
      documentId,
      reason,
      authorizedBy,
      disposedAt: new Date(),
    });
    const saved = await this.disposalRepo.save(disposal);
    this.logger.debug(`document disposed: ${documentId}`);
    return saved;
  }
}
