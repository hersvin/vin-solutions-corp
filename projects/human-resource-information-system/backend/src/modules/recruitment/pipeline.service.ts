import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity.js';
import { Candidate } from '../../entities/candidate.entity.js';
import { CandidateStatus } from '../../entities/candidate.entity.js';
import { Interview } from '../../entities/interview.entity.js';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,
  ) {}

  async createApplication(
    body: {
      candidateId: string;
      requisitionId: string;
      stage?: string;
    },
  ): Promise<Application> {
    const application = this.applicationRepo.create({
      ...body,
      submittedAt: new Date(),
    });
    return this.applicationRepo.save(application);
  }

  async moveCandidateStage(
    candidateId: string,
    newStage: CandidateStatus,
  ): Promise<Candidate> {
    const candidate = await this.candidateRepo.findOne({
      where: { id: candidateId },
    });
    if (!candidate) throw new NotFoundException(`Candidate ${candidateId} not found`);
    candidate.status = newStage;
    return this.candidateRepo.save(candidate);
  }

  async scheduleInterview(
    body: {
      applicationId: string;
      round: number;
      scheduledAt: string;
      interviewers: string[];
    },
  ): Promise<Interview> {
    const interview = this.interviewRepo.create({
      ...body,
      scheduledAt: new Date(body.scheduledAt),
    });
    return this.interviewRepo.save(interview);
  }

  async submitInterviewFeedback(
    interviewId: string,
    feedback: Record<string, unknown>,
    outcome?: string,
  ): Promise<Interview> {
    const interview = await this.interviewRepo.findOne({
      where: { id: interviewId },
    });
    if (!interview) throw new NotFoundException(`Interview ${interviewId} not found`);
    interview.feedback = feedback;
    if (outcome) interview.outcome = outcome;
    return this.interviewRepo.save(interview);
  }
}
