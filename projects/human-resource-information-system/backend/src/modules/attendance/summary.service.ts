import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceEntry } from '../../entities/attendance_entry.entity.js';
import { PeriodAttendanceSummary } from '../../entities/period_attendance_summary.entity.js';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(AttendanceEntry)
    private readonly entryRepo: Repository<AttendanceEntry>,
    @InjectRepository(PeriodAttendanceSummary)
    private readonly summaryRepo: Repository<PeriodAttendanceSummary>,
  ) {}

  async buildPeriodSummary(
    employeeId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<PeriodAttendanceSummary> {
    const entries = await this.entryRepo.find({
      where: { employeeId },
    });

    let totalOt = 0;
    let totalLate = 0;
    let totalBreak = 0;
    let absenceCount = 0;

    for (const entry of entries) {
      totalOt += Number(entry.otHours ?? 0);
      totalLate += entry.lateMinutes;
      totalBreak += entry.breakMinutes;
      if (entry.absenceFlag) absenceCount += 1;
    }

    const summary = this.summaryRepo.create({
      employeeId,
      periodStart,
      periodEnd,
      totals: {
        otHours: totalOt,
        lateMinutes: totalLate,
        breakMinutes: totalBreak,
        absenceCount,
        totalEntries: entries.length,
      },
    });
    return this.summaryRepo.save(summary);
  }
}
