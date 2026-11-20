import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from '../../entities/leave_request.entity.js';
import { LeaveRequestStatus } from '../../entities/leave_request.entity.js';
import { LeaveApproval } from '../../entities/leave_approval.entity.js';
import { LeaveDecision } from '../../entities/leave_approval.entity.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../../core/events/domain-events.js';

@Injectable()
export class ApprovalService {
  private readonly logger = new Logger(ApprovalService.name);

  constructor(
    @InjectRepository(LeaveRequest)
    private readonly requestRepo: Repository<LeaveRequest>,
    @InjectRepository(LeaveApproval)
    private readonly approvalRepo: Repository<LeaveApproval>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async approve(
    requestId: string,
    approverUserId: string,
    roleAtDecision: string,
    comment?: string,
  ): Promise<LeaveApproval> {
    return this.decide(requestId, approverUserId, roleAtDecision, LeaveDecision.APPROVE, comment);
  }

  async reject(
    requestId: string,
    approverUserId: string,
    roleAtDecision: string,
    comment?: string,
  ): Promise<LeaveApproval> {
    return this.decide(requestId, approverUserId, roleAtDecision, LeaveDecision.REJECT, comment);
  }

  private async decide(
    requestId: string,
    approverUserId: string,
    roleAtDecision: string,
    decision: LeaveDecision,
    comment?: string,
  ): Promise<LeaveApproval> {
    const request = await this.requestRepo.findOne({ where: { id: requestId } });
    if (!request) throw new NotFoundException(`Request ${requestId} not found`);

    request.status = decision === LeaveDecision.APPROVE ? LeaveRequestStatus.APPROVED : LeaveRequestStatus.REJECTED;
    request.decidedAt = new Date();
    await this.requestRepo.save(request);

    const approval = this.approvalRepo.create({
      requestId,
      approverUserId,
      roleAtDecision,
      decision,
      comment: comment ?? null,
      decidedAt: new Date(),
    });
    const saved = await this.approvalRepo.save(approval);

    if (decision === LeaveDecision.APPROVE) {
      this.eventEmitter.emit(DOMAIN_EVENTS.LEAVE_APPROVED, {
        correlationId: saved.id,
        entityId: requestId,
        timestamp: new Date(),
      });
      this.logger.debug(`leave approved: request=${requestId}`);
    }

    return saved;
  }
}
