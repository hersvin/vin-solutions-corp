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
import { PunchService } from './punch.service.js';
import { CorrectionService } from './correction.service.js';
import { SummaryService } from './summary.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceEntry } from '../../entities/attendance_entry.entity.js';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly punchService: PunchService,
    private readonly correctionService: CorrectionService,
    private readonly summaryService: SummaryService,
    @InjectRepository(AttendanceEntry)
    private readonly entryRepo: Repository<AttendanceEntry>,
  ) {}

  @Post('punch')
  punch(
    @Body()
    body: {
      employeeId: string;
      shiftId?: string;
      type: 'in' | 'out';
      source?: string;
    },
    @Req() req: AuthedRequest,
  ) {
    const source = body.source ?? 'web';
    if (body.type === 'in') {
      return this.punchService.clockIn(body.employeeId, body.shiftId ?? '', source);
    }
    // clock-out needs an entryId; in a full impl the client passes it
    return this.punchService.clockOut(body.employeeId, source);
  }

  @Get('entries')
  listEntries(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('employeeId') employeeId: string,
  ) {
    return this.entryRepo.find({
      where: { employeeId },
      order: { clockedInAt: 'ASC' },
    });
  }

  @Post('corrections')
  submitCorrection(
    @Body() body: { entryId: string; reason: string },
    @Req() req: AuthedRequest,
  ) {
    const appliedBy = (req.user as { id: string }).id;
    return this.correctionService.submitCorrection(body.entryId, body.reason, appliedBy);
  }

  @Get('summaries')
  buildSummary(
    @Query('period') _period: string,
    @Query('employeeId') employeeId: string,
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.summaryService.buildPeriodSummary(
      employeeId,
      new Date(periodStart),
      new Date(periodEnd),
    );
  }
}
