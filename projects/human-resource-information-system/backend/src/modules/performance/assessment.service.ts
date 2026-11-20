import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from '../../entities/review.entity.js';
import { ReviewResponse } from '../../entities/review_response.entity.js';
import { RaterRole } from '../../entities/review_participant.entity.js';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(ReviewResponse)
    private readonly responseRepo: Repository<ReviewResponse>,
  ) {}

  async submitResponse(body: {
    reviewId: string;
    participantId?: string;
    answers: Record<string, unknown>;
    comments?: string;
    evidenceRefs?: string[];
    raterRole: RaterRole;
  }): Promise<ReviewResponse> {
    const review = await this.reviewRepo.findOne({ where: { id: body.reviewId } });
    if (!review) throw new NotFoundException(`Review ${body.reviewId} not found`);

    const response = this.responseRepo.create({
      reviewId: body.reviewId,
      participantId: body.participantId ?? null,
      answers: body.answers,
      comments: body.comments ?? null,
      evidenceRefs: body.evidenceRefs ?? [],
      submittedAt: new Date(),
    });
    const saved = await this.responseRepo.save(response);

    switch (body.raterRole) {
      case RaterRole.SELF:
        review.status = ReviewStatus.SELF_DONE;
        break;
      case RaterRole.MANAGER:
        review.status = ReviewStatus.MANAGER_DONE;
        break;
      case RaterRole.PEER:
        review.status = ReviewStatus.PEER_DONE;
        break;
      case RaterRole.HR:
        review.status = ReviewStatus.MANAGER_DONE;
        break;
    }
    await this.reviewRepo.save(review);
    this.logger.debug(`Response ${saved.id} submitted for review ${body.reviewId}`);
    return saved;
  }

  async getParticipantReviews(
    reviewCycleId: string,
    employeeId: string,
  ): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { reviewCycleId, employeeId },
      order: { createdAt: 'DESC' },
    });
  }
}
