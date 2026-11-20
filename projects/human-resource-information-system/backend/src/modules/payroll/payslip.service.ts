import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payslip } from '../../entities/payslip.entity.js';
import { PayrollRunItem } from '../../entities/payroll_run_item.entity.js';
import { StorageService } from '../../core/storage/storage.service.js';

@Injectable()
export class PayslipService {
  private readonly logger = new Logger(PayslipService.name);

  constructor(
    @InjectRepository(Payslip) private readonly payslipRepo: Repository<Payslip>,
    @InjectRepository(PayrollRunItem) private readonly itemRepo: Repository<PayrollRunItem>,
    private readonly storageService: StorageService,
  ) {}

  async generate(itemId: string): Promise<Payslip> {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: { payrollRun: true, employee: true } as never,
    });
    if (!item) throw new Error(`Payroll item ${itemId} not found`);

    const pdfContent = Buffer.from(
      `Payslip for ${item.id} - amount: ${item.amount}`,
    );
    const key = `payslips/${item.payrollRunId}/${itemId}.pdf`;
    await this.storageService.upload(key, pdfContent, 'application/pdf');

    const payslip = this.payslipRepo.create({
      payrollRunItemId: itemId,
      pdfStorageKey: key,
      issuedAt: new Date(),
    });
    const saved = await this.payslipRepo.save(payslip);
    this.logger.debug(`payslip generated: ${saved.id}`);
    return saved;
  }
}
