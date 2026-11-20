import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service.js';
import { TaskService } from './task.service.js';
import { DependencyService } from './dependency.service.js';
import { ReportingService } from './reporting.service.js';
import { TaskPriority, TaskStatus } from '../../entities/task.entity.js';
import { DependencyType } from '../../entities/task_dependency.entity.js';
import { ProjectStatus } from '../../entities/project.entity.js';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly dependencyService: DependencyService,
    private readonly reportingService: ReportingService,
  ) {}

  @Get('projects')
  listProjects(@Query('companyId') companyId?: string) {
    return this.projectService.listProjects(companyId);
  }

  @Post('projects')
  createProject(
    @Body()
    body: {
      companyId: string;
      name: string;
      code?: string;
      ownerUserId: string;
      description?: string;
      startDate?: string;
      dueDate?: string;
      budgetRef?: string;
      workspaceId?: string;
      visibility?: string;
    },
  ) {
    return this.projectService.createProject(body);
  }

  @Post('projects/:id/members')
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: string },
  ) {
    return this.projectService.addMember(id, body.userId, body.role);
  }

  @Patch('projects/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ProjectStatus },
  ) {
    return this.projectService.updateStatus(id, body.status);
  }

  @Post('projects/:id/tasks')
  createTask(
    @Param('id') id: string,
    @Body()
    body: {
      milestoneId?: string;
      parentTaskId?: string;
      title: string;
      description?: string;
      ownerUserId?: string;
      dueDate?: string;
      priority?: TaskPriority;
      status?: TaskStatus;
    },
  ) {
    return this.taskService.createTask({ ...body, projectId: id });
  }

  @Patch('tasks/:id')
  moveStatus(
    @Param('id') id: string,
    @Body() body: { status: TaskStatus; actorUserId?: string },
  ) {
    return this.taskService.moveStatus(id, body.status, body.actorUserId);
  }

  @Post('tasks/:id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: { authorUserId: string | null; body: string },
  ) {
    return this.taskService.addComment(id, body.authorUserId, body.body);
  }

  @Get('tasks/:id/activity')
  getActivity(@Param('id') id: string) {
    return this.taskService.getActivities(id);
  }

  @Post('tasks/:id/dependencies')
  addDependency(
    @Param('id') id: string,
    @Body() body: { dependsOnTaskId: string; type: DependencyType },
  ) {
    return this.dependencyService.addDependency(id, body.dependsOnTaskId, body.type);
  }

  @Get('projects/:id/reporting')
  getReport(@Param('id') id: string) {
    return this.reportingService.getReport(id);
  }

  @Get('projects/:id/overdue')
  getOverdue(@Param('id') id: string) {
    return this.dependencyService.detectOverdue(id);
  }
}
