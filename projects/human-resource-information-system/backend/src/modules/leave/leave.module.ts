import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LeaveType } from '../../entities/leave_type.entity.js';
import { LeaveBalance } from '../../entities/leave_balance.entity.js';
import { LeaveRequest } from '../../entities/leave_request.entity.js';
import { LeaveApproval } from '../../entities/leave_approval.entity.js';
import { LeaveLedgerEntry } from '../../entities/leave_ledger_entry.entity.js';
import { LeaveController } from './leave.controller.js';
import { RequestService } from './request.service.js';
import { PolicyService } from './policy.service.js';
import { ApprovalService } from './approval.service.js';
import { LedgerService } from './ledger.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeaveType,
      LeaveBalance,
      LeaveRequest,
      LeaveApproval,
      LeaveLedgerEntry,
    ]),
    EventEmitterModule,
  ],
  controllers: [LeaveController],
  providers: [RequestService, PolicyService, ApprovalService, LedgerService],
  exports: [RequestService, PolicyService, ApprovalService, LedgerService],
})
export class LeaveModule {}
