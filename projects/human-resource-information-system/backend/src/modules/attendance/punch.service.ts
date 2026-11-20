import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceEntry } from '../../entities/attendance_entry.entity.js';

@Injectable()
export class PunchService {
  constructor(
    @InjectRepository(AttendanceEntry)
    private readonly entryRepo: Repository<AttendanceEntry>,
  ) {}

  async clockIn(employeeId: string, shiftId: string, source: string): Promise<AttendanceEntry> {
    const entry = this.entryRepo.create({
      employeeId,
      shiftId,
      clockedInAt: new Date(),
      source: source as never,
      isOriginal: true,
    });
    return this.entryRepo.save(entry);
  }

  async clockOut(entryId: string, source: string): Promise<AttendanceEntry> {
    const entry = await this.entryRepo.findOne({ where: { id: entryId } });
    if (!entry) throw new Error(`Entry ${entryId} not found`);
    entry.clockedOutAt = new Date();
    return this.entryRepo.save(entry);
  }
}
