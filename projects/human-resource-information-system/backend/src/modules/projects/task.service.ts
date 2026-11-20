import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from '../../entities/task.entity.js';
import { TaskComment } from '../../entities/task_comment.entity.js';
import { TaskActivity } from '../../entities/task_activity.entity.js';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskComment)
    private readonly commentRepo: Repository<TaskComment>,
    @InjectRepository(TaskActivity)
    private readonly activityRepo: Repository<TaskActivity>,
  ) {}

  async createTask(body: {
    projectId: string;
    milestoneId?: string;
    parentTaskId?: string;
    title: string;
    description?: string;
    ownerUserId?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  }): Promise<Task> {
    const task = this.taskRepo.create({
      projectId: body.projectId,
      milestoneId: body.milestoneId ?? null,
      parentTaskId: body.parentTaskId ?? null,
      title: body.title,
      description: body.description ?? null,
      ownerUserId: body.ownerUserId ?? null,
      dueDate: body.dueDate ?? null,
      priority: body.priority ?? TaskPriority.LOW,
      status: body.status ?? TaskStatus.TODO,
      progressPct: 0,
    });
    return this.taskRepo.save(task);
  }

  async listTasks(
    projectId: string,
    filters?: { status?: TaskStatus; ownerUserId?: string },
  ): Promise<Task[]> {
    const where: Record<string, unknown> = { projectId, deletedAt: IsNull() };
    if (filters?.status) where.status = filters.status;
    if (filters?.ownerUserId) where.ownerUserId = filters.ownerUserId;
    return this.taskRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async moveStatus(
    taskId: string,
    newStatus: TaskStatus,
    actorUserId?: string,
  ): Promise<Task> {
    const task = await this.findOrThrow(taskId);
    const previousStatus = task.status;
    task.status = newStatus;
    const updated = await this.taskRepo.save(task);

    const activity = this.activityRepo.create({
      taskId,
      actorUserId: actorUserId ?? null,
      action: 'status_change',
      at: new Date(),
      payload: { from: previousStatus, to: newStatus },
    });
    await this.activityRepo.save(activity);

    if (newStatus === TaskStatus.DONE) {
      this.logger.debug(`Task ${taskId} completed`);
    }
    return updated;
  }

  async addComment(
    taskId: string,
    authorUserId: string | null,
    body: string,
  ): Promise<TaskComment> {
    await this.findOrThrow(taskId);
    const comment = this.commentRepo.create({
      taskId,
      authorUserId,
      body,
      createdAt: new Date(),
    });
    return this.commentRepo.save(comment);
  }

  async getActivities(taskId: string): Promise<TaskActivity[]> {
    return this.activityRepo.find({
      where: { taskId },
      order: { at: 'DESC' },
    });
  }

  private async findOrThrow(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
}
