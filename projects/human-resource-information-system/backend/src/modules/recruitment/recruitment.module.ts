import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequisition } from '../../entities/job_requisition.entity.js';
import { Candidate } from '../../entities/candidate.entity.js';
import { Application } from '../../entities/application.entity.js';
import { Interview } from '../../entities/interview.entity.js';
import { Offer } from '../../entities/offer.entity.js';
import { CandidateConsent } from '../../entities/candidate_consent.entity.js';
import { RecruitmentController } from './recruitment.controller.js';
import { RequisitionService } from './requisition.service.js';
import { PipelineService } from './pipeline.service.js';
import { OfferService } from './offer.service.js';
import { ConsentService } from './consent.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobRequisition,
      Candidate,
      Application,
      Interview,
      Offer,
      CandidateConsent,
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [RequisitionService, PipelineService, OfferService, ConsentService],
  exports: [RequisitionService, PipelineService, OfferService, ConsentService],
})
export class RecruitmentModule {}
