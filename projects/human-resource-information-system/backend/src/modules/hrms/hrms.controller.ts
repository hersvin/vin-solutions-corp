import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
type AuthedRequest = Request & { user?: { id: string } };
import { HrmsService } from './hrms.service.js';
import { LifecycleService } from './lifecycle.service.js';
import { DedupeService } from './dedupe.service.js';

@Controller('hrms')
export class HrmsController {
  constructor(
    private readonly hrmsService: HrmsService,
    private readonly lifecycleService: LifecycleService,
    private readonly dedupeService: DedupeService,
  ) {}

  @Get('employees')
  listEmployees(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.hrmsService.listEmployees(
      status,
      Number(limit ?? 50),
      Number(offset ?? 0),
    );
  }

  @Post('employees')
  createEmployee(@Body() body: Partial<Record<string, unknown>>) {
    return this.hrmsService.createEmployee(body as never);
  }

  @Get('employees/:empNo')
  getEmployee(@Param('empNo') empNo: string) {
    return this.hrmsService.getEmployee(empNo);
  }

  @Put('employees/:empNo')
  updateEmployee(
    @Param('empNo') empNo: string,
    @Body() body: Partial<Record<string, unknown>>,
  ) {
    return this.hrmsService.updateEmployee(empNo, body as never);
  }

  @Post('employees/:id/events')
  addEvent(
    @Param('id') id: string,
    @Body()
    body: {
      eventType: string;
      effectiveDate: string;
      payload?: Record<string, unknown>;
    },
    @Req() req: AuthedRequest,
  ) {
    const initiatedBy = (req.user as { id: string }).id;
    return this.hrmsService.addEvent(
      id,
      body.eventType,
      new Date(body.effectiveDate),
      body.payload ?? null,
      initiatedBy,
    );
  }

  @Get('employees/:empNo/history')
  getHistory(@Param('empNo') empNo: string) {
    return this.hrmsService.getHistory(empNo);
  }

  @Post('dedupe-check')
  dedupeCheck(
    @Body() body: { firstName: string; lastName: string; email?: string; govId?: string },
  ) {
    return this.dedupeService.checkDedupe(body);
  }
}
