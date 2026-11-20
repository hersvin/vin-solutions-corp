import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollRun } from '../../entities/payroll_run.entity.js';
import { PayrollRunItem } from '../../entities/payroll_run_item.entity.js';
import { PayPeriod } from '../../entities/pay_period.entity.js';

@Injectable()
export class RunService {
  constructor(
    @InjectRepository(PayrollRun) private readonly runRepo: Repository<PayrollRun>,
    @InjectRepository(PayrollRunItem) private readonly itemRepo: Repository<PayrollRunItem>,
    @InjectRepository(PayPeriod) private readonly periodRepo: Repository<PayPeriod>,
  ) {}

  async listRuns(limit = 50, offset = 0): Promise<PayrollRun[]> {
    return this.runRepo.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async prepareRun(
    payPeriodId: string,
    preparedBy: string,
  ): Promise<PayrollRun> {
    const period = await this.periodRepo.findOne({ where: { id: payPeriodId } });
    if (!period) throw new NotFoundException(`Pay period ${payPeriodId} not found`);
    const run = this.runRepo.create({
      payPeriodId,
      status: 'open' as never,
      preparedBy,
    });
    return this.runRepo.save(run);
  }

  async previewRun(runId: string): Promise<PayrollRunItem[]> {
    return this.itemRepo.find({ where: { payrollRunId: runId } });
  }

  async approveRun(runId: string, approvedBy: string): Promise<PayrollRun> {
    const run = await this.runRepo.findOne({ where: { id: runId } });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    run.status = 'approved' as never;
    run.approvedBy = approvedBy;
    return this.runRepo.save(run);
  }

  async lockRun(runId: string): Promise<PayrollRun> {
    const run = await this.runRepo.findOne({ where: { id: runId } });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    run.status = 'locked' as never;
    run.lockedAt = new Date();
    return this.runRepo.save(run);
  }
}
