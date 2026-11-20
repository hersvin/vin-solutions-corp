import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
type AuthedRequest = Request & { user?: { id: string } };
import { UploadService } from './upload.service.js';
import { VersioningService } from './versioning.service.js';
import { ExpiryService } from './expiry.service.js';
import { RetentionService } from './retention.service.js';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly versioningService: VersioningService,
    private readonly expiryService: ExpiryService,
    private readonly retentionService: RetentionService,
  ) {}

  @Post(':id/versions')
  async uploadVersion(
    @Param('id') id: string,
    @Body() body: { file?: string },
    @Req() req: AuthedRequest,
  ) {
    const userId = (req.user as { id: string }).id;
    const fileContent = Buffer.from(body.file ?? '');
    return this.uploadService.uploadVersion(id, fileContent, 'application/octet-stream', userId);
  }

  @Get(':id/versions')
  getVersions(@Param('id') id: string) {
    return this.versioningService.getVersions(id);
  }

  @Get(':id/download')
  async download(@Param('id') id: string) {
    return { url: await this.uploadService.getDownloadUrl(id) };
  }

  @Get('expiring')
  getExpiring(@Query('days') days?: string) {
    return this.expiryService.getExpiringDocuments(Number(days ?? 30));
  }

  @Post(':id/hold')
  placeHold(@Param('id') id: string) {
    return this.retentionService.placeHold(id);
  }

  @Post(':id/dispose')
  dispose(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Req() req: AuthedRequest,
  ) {
    const userId = (req.user as { id: string }).id;
    return this.retentionService.dispose(id, body.reason, userId);
  }
}
