import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { Task, TaskStatus } from '../../entities/task.entity.js';
import { TaskDependency, DependencyType } from '../../entities/task_dependency.entity.js';

@Injectable()
export class DependencyService {
  private readonly logger = new Logger(DependencyService.name);

  constructor(
    @InjectRepository(TaskDependency)
    private readonly dependencyRepo: Repository<TaskDependency>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async addDependency(
    taskId: string,
    dependsOnTaskId: string,
    type: DependencyType,
  ): Promise<TaskDependency> {
    const dependency = this.dependencyRepo.create({
      taskId,
      dependsOnTaskId,
      type,
    });
    return this.dependencyRepo.save(dependency);
  }

  async detectOverdue(projectId: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.taskRepo.find({
      where: {
        projectId,
        deletedAt: IsNull(),
        status: Not(TaskStatus.DONE),
        dueDate: LessThan(today),
      },
      order: { dueDate: 'ASC' },
    });
  }

  async topologicalOrder(projectId: string): Promise<Task[]> {
    const tasks = await this.taskRepo.find({
      where: { projectId, deletedAt: IsNull() },
    });
    const taskIds = tasks.map((task) => task.id);
    const dependencies = await this.dependencyRepo
      .createQueryBuilder('d')
      .where('d.task_id IN (:...taskIds)', { taskIds })
      .getMany();

    const taskById = new Map<string, Task>();
    for (const task of tasks) taskById.set(task.id, task);

    // in-degree counts how many unresolved prerequisites each task has
    const inDegree = new Map<string, number>();
    // adjacency: dependency -> tasks that depend on it
    const dependents = new Map<string, string[]>();

    for (const task of tasks) {
      inDegree.set(task.id, 0);
      dependents.set(task.id, []);
    }

    for (const dep of dependencies) {
      if (!taskById.has(dep.taskId) || !taskById.has(dep.dependsOnTaskId)) continue;
      // dependsOnTaskId must complete before taskId
      const count = (inDegree.get(dep.taskId) ?? 0) + 1;
      inDegree.set(dep.taskId, count);
      const list = dependents.get(dep.dependsOnTaskId) ?? [];
      list.push(dep.taskId);
      dependents.set(dep.dependsOnTaskId, list);
    }

    const ready = Array.from(tasks).filter((task) => (inDegree.get(task.id) ?? 0) === 0);
    const sorted: Task[] = [];

    while (ready.length > 0) {
      const task = ready.shift()!;
      sorted.push(task);
      for (const dependentId of dependents.get(task.id) ?? []) {
        const count = (inDegree.get(dependentId) ?? 0) - 1;
        inDegree.set(dependentId, count);
        if (count === 0) {
          ready.push(taskById.get(dependentId)!);
        }
      }
    }

    if (sorted.length !== tasks.length) {
      this.logger.warn(`topologicalOrder: cycle detected in project ${projectId}; returning acyclic subset only`);
      return sorted;
    }

    return sorted;
  }
}
