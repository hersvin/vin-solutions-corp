import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ReviewCycle, ReviewCycleStatus } from '../../entities/review_cycle.entity.js';

@Injectable()
export class CycleService {
  constructor(
    @InjectRepository(ReviewCycle)
    private readonly cycleRepo: Repository<ReviewCycle>,
  ) {}

  async createCycle(body: {
    companyId: string;
    name: string;
    periodStart: string;
    periodEnd: string;
    calibrationRequired?: boolean;
    deadline?: string;
  }): Promise<ReviewCycle> {
    const cycle = this.cycleRepo.create({
      ...body,
      status: ReviewCycleStatus.CONFIG,
      deadline: body.deadline ? new Date(body.deadline) : null,
    });
    return this.cycleRepo.save(cycle);
  }

  async listCycles(companyId?: string): Promise<ReviewCycle[]> {
    return this.cycleRepo.find({
      where: { ...({ companyId } as object), deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async activateCycle(id: string): Promise<ReviewCycle> {
    const cycle = await this.findOrThrow(id);
    cycle.status = ReviewCycleStatus.ACTIVE;
    return this.cycleRepo.save(cycle);
  }

  async finalizeCycle(id: string, finalizedBy: string): Promise<ReviewCycle> {
    const cycle = await this.findOrThrow(id);
    cycle.status = ReviewCycleStatus.CLOSED;
    cycle.deadline = new Date();
    void finalizedBy;
    return this.cycleRepo.save(cycle);
  }

  async calibrate(id: string): Promise<ReviewCycle> {
    const cycle = await this.findOrThrow(id);
    cycle.status = ReviewCycleStatus.FINALIZING;
    return this.cycleRepo.save(cycle);
  }

  private async findOrThrow(id: string): Promise<ReviewCycle> {
    const cycle = await this.cycleRepo.findOne({ where: { id } });
    if (!cycle) throw new NotFoundException(`Review cycle ${id} not found`);
    return cycle;
  }
}
