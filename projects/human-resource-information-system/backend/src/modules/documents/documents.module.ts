import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../entities/document.entity.js';
import { DocumentVersion } from '../../entities/document_version.entity.js';
import { DocumentDisposal } from '../../entities/document_disposal.entity.js';
import { StorageModule } from '../../core/storage/storage.module.js';
import { DocumentsController } from './documents.controller.js';
import { UploadService } from './upload.service.js';
import { VersioningService } from './versioning.service.js';
import { ExpiryService } from './expiry.service.js';
import { RetentionService } from './retention.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, DocumentVersion, DocumentDisposal]),
    StorageModule,
  ],
  controllers: [DocumentsController],
  providers: [UploadService, VersioningService, ExpiryService, RetentionService],
  exports: [UploadService, VersioningService, ExpiryService, RetentionService],
})
export class DocumentsModule {}
