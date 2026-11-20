import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ImsSyncService {
  private readonly logger = new Logger(ImsSyncService.name);

  async syncCatalog(categoryId: string): Promise<{ synced: boolean }> {
    this.logger.log(`IMS sync not yet implemented for category ${categoryId}`);
    return { synced: false };
  }
}
