import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRequest } from '../../entities/approval_request.entity.js';
import { ApprovalsController } from './approvals.controller.js';
import { ApprovalEngineService } from './approval-engine.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalRequest])],
  controllers: [ApprovalsController],
  providers: [ApprovalEngineService],
  exports: [ApprovalEngineService],
})
export class ApprovalsModule {}
