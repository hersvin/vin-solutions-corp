import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntry } from '../../entities/attendance_entry.entity.js';
import { AttendanceAdjustment } from '../../entities/attendance_adjustment.entity.js';
import { PeriodAttendanceSummary } from '../../entities/period_attendance_summary.entity.js';
import { WorkSchedule } from '../../entities/work_schedule.entity.js';
import { Shift } from '../../entities/shift.entity.js';
import { AttendanceController } from './attendance.controller.js';
import { PunchService } from './punch.service.js';
import { CorrectionService } from './correction.service.js';
import { SummaryService } from './summary.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceEntry,
      AttendanceAdjustment,
      PeriodAttendanceSummary,
      WorkSchedule,
      Shift,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [PunchService, CorrectionService, SummaryService],
  exports: [PunchService, CorrectionService, SummaryService],
})
export class AttendanceModule {}
