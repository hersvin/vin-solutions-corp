import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceAdjustment } from '../../entities/attendance_adjustment.entity.js';
import { AttendanceEntry } from '../../entities/attendance_entry.entity.js';

@Injectable()
export class CorrectionService {
  constructor(
    @InjectRepository(AttendanceAdjustment)
    private readonly adjRepo: Repository<AttendanceAdjustment>,
    @InjectRepository(AttendanceEntry)
    private readonly entryRepo: Repository<AttendanceEntry>,
  ) {}

  async submitCorrection(
    entryId: string,
    reason: string,
    appliedBy: string,
  ): Promise<AttendanceAdjustment> {
    const entry = await this.entryRepo.findOne({ where: { id: entryId } });
    if (!entry) throw new Error(`Entry ${entryId} not found`);
    const adjustment = this.adjRepo.create({
      attendanceEntryId: entryId,
      reason,
      appliedBy,
      approvalStatus: 'pending',
    });
    return this.adjRepo.save(adjustment);
  }

  async applyAdjustment(adjustmentId: string): Promise<AttendanceAdjustment> {
    const adjustment = await this.adjRepo.findOne({
      where: { id: adjustmentId },
      relations: { attendanceEntry: true } as never,
    });
    if (!adjustment) throw new Error(`Adjustment ${adjustmentId} not found`);
    if (adjustment.approvalStatus !== 'approved') {
      throw new Error('Adjustment must be approved before applying');
    }
    adjustment.appliedAt = new Date();
    adjustment.approvalStatus = 'applied';
    return this.adjRepo.save(adjustment);
  }
}
