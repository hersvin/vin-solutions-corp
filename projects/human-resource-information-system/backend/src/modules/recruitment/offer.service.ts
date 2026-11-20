import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../../entities/offer.entity.js';
import { Candidate } from '../../entities/candidate.entity.js';
import { CandidateStatus } from '../../entities/candidate.entity.js';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    @InjectRepository(Offer) private readonly offerRepo: Repository<Offer>,
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
  ) {}

  async accept(offerId: string): Promise<Offer> {
    const offer = await this.offerRepo.findOne({
      where: { id: offerId },
      relations: { application: true, 'application.candidate': true } as never,
    });
    if (!offer) throw new NotFoundException(`Offer ${offerId} not found`);
    offer.acceptedAt = new Date();
    await this.offerRepo.save(offer);
    await this.candidateRepo.update(offer.application.candidateId, {
      status: CandidateStatus.HIRED,
    });
    this.logger.debug(`offer accepted: ${offerId}`);
    return offer;
  }

  async decline(offerId: string): Promise<Offer> {
    const offer = await this.offerRepo.findOne({
      where: { id: offerId },
      relations: { application: true } as never,
    });
    if (!offer) throw new NotFoundException(`Offer ${offerId} not found`);
    offer.declinedAt = new Date();
    await this.offerRepo.save(offer);
    await this.candidateRepo.update(offer.application.candidateId, {
      status: CandidateStatus.REJECTED,
    });
    this.logger.debug(`offer declined: ${offerId}`);
    return offer;
  }
}
