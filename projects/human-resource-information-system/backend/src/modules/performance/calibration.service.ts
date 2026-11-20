import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalibrationSession } from '../../entities/calibration_session.entity.js';

@Injectable()
export class CalibrationService {
  constructor(
    @InjectRepository(CalibrationSession)
    private readonly sessionRepo: Repository<CalibrationSession>,
  ) {}

  async createSession(body: {
    reviewCycleId: string;
    heldAt: string;
    participants: string[];
  }): Promise<CalibrationSession> {
    const session = this.sessionRepo.create({
      reviewCycleId: body.reviewCycleId,
      heldAt: new Date(body.heldAt),
      participants: body.participants,
      outcomes: null,
    });
    return this.sessionRepo.save(session);
  }

  async recordOutcomes(
    sessionId: string,
    outcomes: Record<string, unknown>,
  ): Promise<CalibrationSession> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException(`Calibration session ${sessionId} not found`);
    session.outcomes = outcomes;
    return this.sessionRepo.save(session);
  }
}
