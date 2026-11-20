import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RequisitionService } from './requisition.service.js';
import { PipelineService } from './pipeline.service.js';
import { OfferService } from './offer.service.js';
import { ConsentService } from './consent.service.js';
import { CandidateStatus } from '../../entities/candidate.entity.js';

@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly requisitionService: RequisitionService,
    private readonly pipelineService: PipelineService,
    private readonly offerService: OfferService,
    private readonly consentService: ConsentService,
  ) {}

  @Post('requisitions')
  createRequisition(
    @Body()
    body: {
      companyId: string;
      positionId?: string;
      hiringManagerUserId?: string;
      headcount?: number;
      budgetRef?: string;
    },
  ) {
    return this.requisitionService.create(body);
  }

  @Get('requisitions')
  listRequisitions(@Query('companyId') companyId?: string) {
    return this.requisitionService.list(companyId);
  }

  @Post('applications')
  createApplication(
    @Body() body: { candidateId: string; requisitionId: string; stage?: string },
  ) {
    return this.pipelineService.createApplication(body);
  }

  @Post('candidates/:id/stage')
  moveStage(
    @Param('id') id: string,
    @Body() body: { newStage: CandidateStatus },
  ) {
    return this.pipelineService.moveCandidateStage(id, body.newStage);
  }

  @Post('interviews')
  scheduleInterview(
    @Body()
    body: {
      applicationId: string;
      round: number;
      scheduledAt: string;
      interviewers: string[];
    },
  ) {
    return this.pipelineService.scheduleInterview(body);
  }

  @Post('interviews/:id/feedback')
  submitFeedback(
    @Param('id') id: string,
    @Body() body: { feedback: Record<string, unknown>; outcome?: string },
  ) {
    return this.pipelineService.submitInterviewFeedback(id, body.feedback, body.outcome);
  }

  @Post('offers/:id/accept')
  acceptOffer(@Param('id') id: string) {
    return this.offerService.accept(id);
  }

  @Post('offers/:id/decline')
  declineOffer(@Param('id') id: string) {
    return this.offerService.decline(id);
  }

  @Post('consent')
  recordConsent(
    @Body() body: { candidateId: string; consentType: string },
  ) {
    return this.consentService.recordConsent(body.candidateId, body.consentType);
  }

  @Post('consent/:id/revoke')
  revokeConsent(@Param('id') id: string) {
    return this.consentService.revokeConsent(id);
  }
}
