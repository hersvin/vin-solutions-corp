import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveBalance } from '../../entities/leave_balance.entity.js';
import { LeaveType } from '../../entities/leave_type.entity.js';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);

  constructor(
    @InjectRepository(LeaveBalance)
    private readonly balanceRepo: Repository<LeaveBalance>,
    @InjectRepository(LeaveType)
    private readonly typeRepo: Repository<LeaveType>,
  ) {}

  async getBalance(employeeId: string, leaveTypeId: string, period?: string) {
    const where: Record<string, unknown> = {
      employeeId,
      leaveTypeId,
    };
    if (period) where.period = period;
    const balance = await this.balanceRepo.findOne({ where });
    return balance ?? null;
  }

  async checkSufficiency(
    employeeId: string,
    leaveTypeId: string,
    daysRequired: number,
  ): Promise<boolean> {
    const balance = await this.getBalance(employeeId, leaveTypeId);
    if (!balance) return false;
    const available = Number(balance.available);
    this.logger.debug(
      `leave sufficiency check: employee=${employeeId} required=${daysRequired} available=${available}`,
    );
    return available >= daysRequired;
  }

  async getLeaveType(leaveTypeId: string): Promise<LeaveType> {
    const type = await this.typeRepo.findOne({ where: { id: leaveTypeId } });
    if (!type) throw new Error(`Leave type ${leaveTypeId} not found`);
    return type;
  }
}
