import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Task, TaskStatus } from '../../entities/task.entity.js';
import { ProjectMember } from '../../entities/project_member.entity.js';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
  ) {}

  async getReport(projectId: string) {
    const totalTasks = await this.taskRepo.count({
      where: { projectId, deletedAt: IsNull() },
    });

    const completedTasks = await this.taskRepo.count({
      where: { projectId, status: TaskStatus.DONE, deletedAt: IsNull() },
    });

    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = await this.taskRepo
      .createQueryBuilder('task')
      .where('task.project_id = :projectId', { projectId })
      .andWhere('task.deleted_at IS NULL')
      .andWhere('task.status != :doneStatus', { doneStatus: TaskStatus.DONE })
      .andWhere(
        new Brackets((qb) => {
          qb.where('task.due_date < :today').orWhere('task.due_date IS NULL');
        }),
      )
      .setParameters({ today })
      .getCount();

    const progressRows: Array<{ avg_progress: number }> =
      await this.taskRepo
        .createQueryBuilder('task')
        .select('AVG(task.progress_pct)', 'avg_progress')
        .where('task.project_id = :projectId', { projectId })
        .andWhere('task.deleted_at IS NULL')
        .getRawMany();

    const avgProgressPct =
      progressRows.length > 0 && progressRows[0].avg_progress !== null
        ? Number(progressRows[0].avg_progress)
        : 0;

    const membersCount = await this.memberRepo.count({
      where: { projectId },
    });

    this.logger.debug(
      `Report for project ${projectId}: total=${totalTasks}, completed=${completedTasks}`,
    );

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      avgProgressPct,
      membersCount,
    };
  }
}
