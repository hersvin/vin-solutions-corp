import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateConsent } from '../../entities/candidate_consent.entity.js';

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(
    @InjectRepository(CandidateConsent)
    private readonly consentRepo: Repository<CandidateConsent>,
  ) {}

  async recordConsent(
    candidateId: string,
    consentType: string,
  ): Promise<CandidateConsent> {
    const consent = this.consentRepo.create({
      candidateId,
      consentType,
      grantedAt: new Date(),
    });
    const saved = await this.consentRepo.save(consent);
    this.logger.debug(`consent recorded: candidate=${candidateId} type=${consentType}`);
    return saved;
  }

  async revokeConsent(consentId: string): Promise<CandidateConsent> {
    const consent = await this.consentRepo.findOne({ where: { id: consentId } });
    if (!consent) throw new NotFoundException(`Consent ${consentId} not found`);
    consent.revokedAt = new Date();
    return this.consentRepo.save(consent);
  }
}
