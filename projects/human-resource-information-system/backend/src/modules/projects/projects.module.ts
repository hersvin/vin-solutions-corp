import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity.js';
import { ProjectMember } from '../../entities/project_member.entity.js';
import { Milestone } from '../../entities/milestone.entity.js';
import { Task } from '../../entities/task.entity.js';
import { TaskDependency } from '../../entities/task_dependency.entity.js';
import { TaskComment } from '../../entities/task_comment.entity.js';
import { TaskAttachment } from '../../entities/task_attachment.entity.js';
import { TaskActivity } from '../../entities/task_activity.entity.js';
import { ProjectNotificationPref } from '../../entities/project_notification_pref.entity.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectService } from './project.service.js';
import { TaskService } from './task.service.js';
import { DependencyService } from './dependency.service.js';
import { ReportingService } from './reporting.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMember,
      Milestone,
      Task,
      TaskDependency,
      TaskComment,
      TaskAttachment,
      TaskActivity,
      ProjectNotificationPref,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService, TaskService, DependencyService, ReportingService],
  exports: [ProjectService, TaskService, DependencyService, ReportingService],
})
export class ProjectsModule {}
