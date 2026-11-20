import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Goal } from '../../entities/goal.entity.js';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepo: Repository<Goal>,
  ) {}

  async createGoal(body: {
    employeeId: string;
    reviewId?: string;
    title: string;
    targetDate?: string;
    milestones?: Record<string, unknown>;
  }): Promise<Goal> {
    const goal = this.goalRepo.create({
      employeeId: body.employeeId,
      reviewId: body.reviewId ?? null,
      title: body.title,
      targetDate: body.targetDate ?? null,
      milestones: body.milestones ?? null,
      status: 'active',
      progressPct: 0,
    });
    return this.goalRepo.save(goal);
  }

  async updateProgress(goalId: string, progressPct: number): Promise<Goal> {
    const goal = await this.findOrThrow(goalId);
    goal.progressPct = progressPct;
    if (progressPct >= 100) goal.status = 'completed';
    return this.goalRepo.save(goal);
  }

  async listGoals(employeeId: string): Promise<Goal[]> {
    return this.goalRepo.find({
      where: { employeeId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  private async findOrThrow(id: string): Promise<Goal> {
    const goal = await this.goalRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!goal) throw new NotFoundException(`Goal ${id} not found`);
    return goal;
  }
}
