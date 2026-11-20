import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayrollRun } from '../../entities/payroll_run.entity.js';
import { PayrollRunItem } from '../../entities/payroll_run_item.entity.js';

@Injectable()
export class AmsExportService {
  private readonly logger = new Logger(AmsExportService.name);

  constructor(
    @InjectRepository(PayrollRun) private readonly runRepo: Repository<PayrollRun>,
    @InjectRepository(PayrollRunItem) private readonly itemRepo: Repository<PayrollRunItem>,
  ) {}

  async exportRun(runId: string): Promise<{ runId: string; itemIds: string[] }> {
    const run = await this.runRepo.findOne({ where: { id: runId } });
    if (!run) throw new Error(`Run ${runId} not found`);
    if (run.status !== 'approved') {
      throw new Error(`Run ${runId} is not approved`);
    }
    const items = await this.itemRepo.find({
      where: { payrollRunId: runId },
    });
    this.logger.log(
      `AMS export: run=${runId} items=${items.length} total=${items
        .reduce((sum, i) => sum + Number(i.amount), 0)
        .toFixed(2)}`,
    );
    // Stub: actual AMS integration will write to ams_payroll_journal
    return { runId, itemIds: items.map((i) => i.id) };
  }
}
