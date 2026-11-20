import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentVersion } from '../../entities/document_version.entity.js';

@Injectable()
export class VersioningService {
  constructor(
    @InjectRepository(DocumentVersion)
    private readonly versionRepo: Repository<DocumentVersion>,
  ) {}

  async getVersions(documentId: string): Promise<DocumentVersion[]> {
    return this.versionRepo.find({
      where: { documentId },
      order: { versionNo: 'DESC' },
    });
  }

  async getVersion(documentId: string, versionNo: number): Promise<DocumentVersion> {
    const version = await this.versionRepo.findOne({
      where: { documentId, versionNo },
    });
    if (!version) {
      throw new NotFoundException(`Version ${versionNo} not found for document ${documentId}`);
    }
    return version;
  }
}
