import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RequestService } from './request.service.js';
import { PolicyService } from './policy.service.js';
import { ApprovalService } from './approval.service.js';
import { LedgerService } from './ledger.service.js';

@Controller('leave')
export class LeaveController {
  constructor(
    private readonly requestService: RequestService,
    private readonly policyService: PolicyService,
    private readonly approvalService: ApprovalService,
    private readonly ledgerService: LedgerService,
  ) {}

  @Post('requests')
  createRequest(
    @Body()
    body: {
      employeeId: string;
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      hours?: string;
    },
  ) {
    return this.requestService.createRequest(body);
  }

  @Post('requests/:id/submit')
  submit(@Param('id') id: string) {
    return this.requestService.submit(id);
  }

  @Post('requests/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.requestService.cancel(id);
  }

  @Post('requests/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approverUserId: string; roleAtDecision: string; comment?: string },
  ) {
    return this.approvalService.approve(id, body.approverUserId, body.roleAtDecision, body.comment);
  }

  @Post('requests/:id/reject')
  reject(
    @Param('id') id: string,
    @Body() body: { approverUserId: string; roleAtDecision: string; comment?: string },
  ) {
    return this.approvalService.reject(id, body.approverUserId, body.roleAtDecision, body.comment);
  }

  @Get('balances')
  getBalance(
    @Query('employeeId') employeeId: string,
    @Query('leaveTypeId') leaveTypeId?: string,
    @Query('period') period?: string,
  ) {
    return this.policyService.getBalance(employeeId, leaveTypeId ?? '', period);
  }

  @Get('ledger')
  getLedger(
    @Query('employeeId') employeeId: string,
    @Query('leaveTypeId') leaveTypeId?: string,
  ) {
    return this.ledgerService.getLedger(employeeId, leaveTypeId);
  }
}
