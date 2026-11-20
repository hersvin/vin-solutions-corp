import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ApprovalRequest, ApprovalStatus } from '../../entities/approval_request.entity.js';

@Injectable()
export class ApprovalEngineService {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly approvalRepo: Repository<ApprovalRequest>,
  ) {}

  async submit(body: {
    requesterUserId: string;
    approverUserId: string;
    module: string;
    entityType: string;
    entityId: string;
    comment?: string;
  }): Promise<ApprovalRequest> {
    const request = this.approvalRepo.create({
      requesterUserId: body.requesterUserId,
      approverUserId: body.approverUserId,
      module: body.module,
      entityType: body.entityType,
      entityId: body.entityId,
      status: ApprovalStatus.PENDING,
      comment: body.comment ?? null,
    });
    return this.approvalRepo.save(request);
  }

  async decide(
    approvalId: string,
    decision: ApprovalStatus,
    comment?: string,
    decidedBy?: string,
  ): Promise<ApprovalRequest> {
    void decidedBy;
    const request = await this.approvalRepo.findOne({
      where: { id: approvalId, deletedAt: IsNull() },
    });
    if (!request) throw new NotFoundException(`Approval request ${approvalId} not found`);
    request.status = decision;
    request.decidedAt = new Date();
    if (comment) request.comment = comment;
    return this.approvalRepo.save(request);
  }

  async listForApprover(
    approverUserId: string,
    status?: ApprovalStatus,
  ): Promise<ApprovalRequest[]> {
    return this.approvalRepo.find({
      where: {
        approverUserId,
        deletedAt: IsNull(),
        ...(status ? { status } : {}),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
