import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApprovalEngineService } from './approval-engine.service.js';
import { ApprovalStatus } from '../../entities/approval_request.entity.js';

interface AuthedRequest extends Request {
  user?: { id: string };
}

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalService: ApprovalEngineService) {}

  @Post()
  submit(
    @Body()
    body: {
      requesterUserId: string;
      approverUserId: string;
      module: string;
      entityType: string;
      entityId: string;
      comment?: string;
    },
  ) {
    return this.approvalService.submit(body);
  }

  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @Req() req: AuthedRequest,
  ) {
    const decidedBy = req.user?.id ?? '';
    return this.approvalService.decide(id, ApprovalStatus.APPROVED, body.comment, decidedBy);
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() body: { comment?: string },
    @Req() req: AuthedRequest,
  ) {
    const decidedBy = req.user?.id ?? '';
    return this.approvalService.decide(id, ApprovalStatus.REJECTED, body.comment, decidedBy);
  }

  @Get('for-me')
  getPendingForMe(@Req() req: AuthedRequest) {
    const userId = req.user?.id ?? '';
    return this.approvalService.listForApprover(userId, ApprovalStatus.PENDING);
  }
}
