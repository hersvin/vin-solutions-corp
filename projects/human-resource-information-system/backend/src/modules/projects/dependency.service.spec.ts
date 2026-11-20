import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DependencyService } from './dependency.service.js';
import { Task, TaskStatus } from '../../entities/task.entity.js';
import { TaskDependency, DependencyType } from '../../entities/task_dependency.entity.js';

const PROJECT_ID = '11111111-1111-4111-8111-111111111111';
const TASK_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TASK_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const TASK_C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const TASK_D = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

function makeTask(id: string, projectId = PROJECT_ID): Task {
  return {
    id,
    projectId,
    milestoneId: null,
    parentTaskId: null,
    title: `Task ${id.slice(0, 4)}`,
    description: null,
    ownerUserId: null,
    dueDate: null,
    priority: 'low',
    status: TaskStatus.TODO,
    progressPct: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Task;
}

function makeDependency(taskId: string, dependsOnTaskId: string): TaskDependency {
  return {
    id: `${taskId}-${dependsOnTaskId}`,
    taskId,
    dependsOnTaskId,
    type: DependencyType.FINISH_START,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as TaskDependency;
}

type DepRepoMock = {
  createQueryBuilder: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
};

function makeDepRepoMock(deps: TaskDependency[]): DepRepoMock {
  const qb = {
    where: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue(deps),
  };
  return {
    createQueryBuilder: vi.fn().mockReturnValue(qb),
    create: vi.fn(),
    save: vi.fn(),
  };
}

describe('DependencyService', () => {
  let service: DependencyService;
  let taskRepoMock: { find: ReturnType<typeof vi.fn> };
  let depRepoMock: DepRepoMock;

  async function buildService(deps: TaskDependency[]) {
    taskRepoMock = { find: vi.fn() };
    depRepoMock = makeDepRepoMock(deps);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DependencyService,
        { provide: getRepositoryToken(Task), useValue: taskRepoMock },
        {
          provide: getRepositoryToken(TaskDependency),
          useValue: depRepoMock,
        },
      ],
    }).compile();

    service = module.get<DependencyService>(DependencyService);
  }

  describe('topologicalOrder', () => {
    it('returns tasks respecting dependency edges', async () => {
      await buildService([
        makeDependency(TASK_B, TASK_A),
        makeDependency(TASK_C, TASK_B),
      ]);
      const tasks = [makeTask(TASK_A), makeTask(TASK_B), makeTask(TASK_C)];
      taskRepoMock.find.mockResolvedValue(tasks);

      const result = await service.topologicalOrder(PROJECT_ID);
      expect(result.map((t: Task) => t.id)).toEqual([TASK_A, TASK_B, TASK_C]);
    });

    it('handles multiple roots (in-degree 0 tasks first)', async () => {
      await buildService([
        makeDependency(TASK_C, TASK_A),
        makeDependency(TASK_D, TASK_B),
      ]);
      const tasks = [
        makeTask(TASK_A),
        makeTask(TASK_B),
        makeTask(TASK_C),
        makeTask(TASK_D),
      ];
      taskRepoMock.find.mockResolvedValue(tasks);

      const result = await service.topologicalOrder(PROJECT_ID);
      const ids = result.map((t: Task) => t.id);
      expect(ids.indexOf(TASK_A)).toBeLessThan(ids.indexOf(TASK_C));
      expect(ids.indexOf(TASK_B)).toBeLessThan(ids.indexOf(TASK_D));
    });

    it('returns only acyclic subset when cycle exists', async () => {
      await buildService([
        makeDependency(TASK_A, TASK_B),
        makeDependency(TASK_B, TASK_C),
        makeDependency(TASK_C, TASK_A),
      ]);
      const tasks = [makeTask(TASK_A), makeTask(TASK_B), makeTask(TASK_C)];
      taskRepoMock.find.mockResolvedValue(tasks);

      const result = await service.topologicalOrder(PROJECT_ID);
      expect(result.length).toBe(0);
    });

    it('returns empty array when project has no tasks', async () => {
      await buildService([]);
      taskRepoMock.find.mockResolvedValue([]);

      const result = await service.topologicalOrder(PROJECT_ID);
      expect(result).toEqual([]);
    });

    it('ignores dependency edges pointing to tasks not in project', async () => {
      const externalId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
      await buildService([makeDependency(TASK_A, externalId)]);
      const tasks = [makeTask(TASK_A), makeTask(TASK_B)];
      taskRepoMock.find.mockResolvedValue(tasks);

      const result = await service.topologicalOrder(PROJECT_ID);
      expect(result.length).toBe(2);
    });
  });

  describe('addDependency', () => {
    it('creates and saves a TaskDependency', async () => {
      await buildService([]);
      const dep = makeDependency(TASK_B, TASK_A);
      depRepoMock.create.mockReturnValue(dep);
      depRepoMock.save.mockResolvedValue(dep);

      const result = await service.addDependency(
        TASK_B,
        TASK_A,
        DependencyType.FINISH_START,
      );
      expect(result).toBe(dep);
      expect(depRepoMock.create).toHaveBeenCalledWith({
        taskId: TASK_B,
        dependsOnTaskId: TASK_A,
        type: DependencyType.FINISH_START,
      });
      expect(depRepoMock.save).toHaveBeenCalledWith(dep);
    });
  });
});
