import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveLedgerEntry } from '../../entities/leave_ledger_entry.entity.js';
import { LeaveBalance } from '../../entities/leave_balance.entity.js';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    @InjectRepository(LeaveLedgerEntry)
    private readonly ledgerRepo: Repository<LeaveLedgerEntry>,
    @InjectRepository(LeaveBalance)
    private readonly balanceRepo: Repository<LeaveBalance>,
  ) {}

  async postApproval(
    employeeId: string,
    leaveTypeId: string,
    requestId: string,
    effectiveDate: Date,
    daysDelta: number,
  ): Promise<LeaveLedgerEntry> {
    const balance = await this.balanceRepo.findOne({
      where: { employeeId, leaveTypeId },
    });
    let balanceAfter: string;
    if (balance) {
      const currentAvailable = Number(balance.available);
      const newAvailable = currentAvailable - daysDelta;
      balance.used = String(Number(balance.used) + daysDelta);
      balance.available = String(newAvailable);
      await this.balanceRepo.save(balance);
      balanceAfter = String(newAvailable);
    } else {
      const newBalance = this.balanceRepo.create({
        employeeId,
        leaveTypeId,
        period: 'current',
        accrued: '0',
        used: String(daysDelta),
        carryover: '0',
        available: String(-daysDelta),
      });
      await this.balanceRepo.save(newBalance);
      balanceAfter = String(-daysDelta);
    }

    const entry = this.ledgerRepo.create({
      employeeId,
      leaveTypeId,
      requestId,
      effectiveDate,
      deltaDays: String(daysDelta),
      balanceAfter,
      postedAt: new Date(),
    });
    const saved = await this.ledgerRepo.save(entry);
    this.logger.debug(
      `ledger posted: employee=${employeeId} request=${requestId} delta=${daysDelta}`,
    );
    return saved;
  }

  async getLedger(employeeId: string, leaveTypeId?: string): Promise<LeaveLedgerEntry[]> {
    const where: Record<string, unknown> = { employeeId };
    if (leaveTypeId) where.leaveTypeId = leaveTypeId;
    return this.ledgerRepo.find({
      where,
      order: { postedAt: 'DESC' },
    });
  }
}
