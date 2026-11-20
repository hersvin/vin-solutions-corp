import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Document } from '../../entities/document.entity.js';
import { DocumentStatus } from '../../entities/document.entity.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../../core/events/domain-events.js';

@Injectable()
export class ExpiryService {
  private readonly logger = new Logger(ExpiryService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getExpiringDocuments(daysAhead: number): Promise<Document[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysAhead);
    return this.documentRepo
      .createQueryBuilder('d')
      .where('d.expiry_date IS NOT NULL')
      .andWhere('d.expiry_date <= :cutoff', { cutoff })
      .andWhere('d.status != :expired', { expired: DocumentStatus.EXPIRED })
      .andWhere('d.status != :disposed', { disposed: DocumentStatus.DISPOSED })
      .getMany();
  }

  async checkExpiries(): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    const expired = await this.documentRepo
      .createQueryBuilder('d')
      .where('d.expiry_date IS NOT NULL')
      .andWhere('d.expiry_date < :today', { today })
      .andWhere('d.status != :disposed', { disposed: DocumentStatus.DISPOSED })
      .getMany();

    for (const doc of expired) {
      doc.status = DocumentStatus.EXPIRED;
      await this.documentRepo.save(doc);
      this.eventEmitter.emit(DOMAIN_EVENTS.DOCUMENT_EXPIRED, {
        correlationId: doc.id,
        entityId: doc.id,
        timestamp: new Date(),
      });
      this.logger.debug(`document expired: ${doc.id}`);
    }

    return expired.length;
  }
}
