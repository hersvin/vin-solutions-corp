import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollRun } from '../../entities/payroll_run.entity.js';
import { PayrollRunItem } from '../../entities/payroll_run_item.entity.js';

export interface CalculationInput {
  baseSalary: number;
  overtimeHours: number;
  otRate: number;
  deductions: number;
}

@Injectable()
export class CalculationService {
  constructor(
    @InjectRepository(PayrollRun) private readonly runRepo: Repository<PayrollRun>,
    @InjectRepository(PayrollRunItem) private readonly itemRepo: Repository<PayrollRunItem>,
  ) {}

  async calculateRun(runId: string): Promise<void> {
    const run = await this.runRepo.findOne({ where: { id: runId } });
    if (!run) throw new Error(`Run ${runId} not found`);
    const items = await this.itemRepo.find({
      where: { payrollRunId: runId },
    });
    for (const item of items) {
      const earnings = item.qty * item.rate;
      const ot = 0;
      const total = earnings + ot;
      item.amount = String(total);
      await this.itemRepo.save(item);
    }
  }
}
