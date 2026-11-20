import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AmsService {
  private readonly logger = new Logger(AmsService.name);

  exportJournal(journalRef: string): { exported: boolean; ref: string } {
    this.logger.log(`AMS journal export stub: ${journalRef}`);
    return { exported: false, ref: journalRef };
  }
}
