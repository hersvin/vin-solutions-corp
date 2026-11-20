import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
type AuthedRequest = Request & { user?: { id: string } };
import { RunService } from './run.service.js';
import { CalculationService } from './calculation.service.js';
import { PayslipService } from './payslip.service.js';
import { AmsExportService } from './ams-export.service.js';

@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly runService: RunService,
    private readonly calcService: CalculationService,
    private readonly payslipService: PayslipService,
    private readonly amsExportService: AmsExportService,
  ) {}

  @Get('runs')
  listRuns(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.runService.listRuns(Number(limit ?? 50), Number(offset ?? 0));
  }

  @Post('runs')
  createRun(
    @Body() body: { payPeriodId: string },
    @Req() req: AuthedRequest,
  ) {
    const preparedBy = (req.user as { id: string }).id;
    return this.runService.prepareRun(body.payPeriodId, preparedBy);
  }

  @Post('runs/:id/preview')
  previewRun(@Param('id') id: string) {
    return this.calcService.calculateRun(id);
  }

  @Post('runs/:id/approve')
  approveRun(
    @Param('id') id: string,
    @Req() req: AuthedRequest,
  ) {
    const approvedBy = (req.user as { id: string }).id;
    return this.runService.approveRun(id, approvedBy);
  }

  @Post('runs/:id/lock')
  lockRun(@Param('id') id: string) {
    return this.runService.lockRun(id);
  }

  @Post('runs/:id/export-ams')
  exportAms(@Param('id') id: string) {
    return this.amsExportService.exportRun(id);
  }

  @Post('payslips/:itemId/generate')
  generatePayslip(@Param('itemId') itemId: string) {
    return this.payslipService.generate(itemId);
  }
}
