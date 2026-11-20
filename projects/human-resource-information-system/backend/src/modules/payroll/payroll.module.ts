import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollRun } from '../../entities/payroll_run.entity.js';
import { PayrollRunItem } from '../../entities/payroll_run_item.entity.js';
import { PayPeriod } from '../../entities/pay_period.entity.js';
import { PayGroup } from '../../entities/pay_group.entity.js';
import { Payslip } from '../../entities/payslip.entity.js';
import { SalaryComponent } from '../../entities/salary_component.entity.js';
import { StorageModule } from '../../core/storage/storage.module.js';
import { PayrollController } from './payroll.controller.js';
import { RunService } from './run.service.js';
import { CalculationService } from './calculation.service.js';
import { PayslipService } from './payslip.service.js';
import { AmsExportService } from './ams-export.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayrollRun,
      PayrollRunItem,
      PayPeriod,
      PayGroup,
      Payslip,
      SalaryComponent,
    ]),
    StorageModule,
  ],
  controllers: [PayrollController],
  providers: [RunService, CalculationService, PayslipService, AmsExportService],
  exports: [RunService, CalculationService, PayslipService, AmsExportService],
})
export class PayrollModule {}
