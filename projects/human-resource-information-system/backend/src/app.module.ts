import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import appConfig from './config/app.config.js';
import dbConfig from './config/db.config.js';
import storageConfig from './config/storage.config.js';
import { DatabaseModule } from './core/database/database.module.js';
import { StorageModule } from './core/storage/storage.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './modules/auth/auth.module.js';
import { RbacModule } from './modules/rbac/rbac.module.js';
import { CmsModule } from './modules/cms/cms.module.js';
import { HrmsModule } from './modules/hrms/hrms.module.js';
import { PayrollModule } from './modules/payroll/payroll.module.js';
import { AttendanceModule } from './modules/attendance/attendance.module.js';
import { LeaveModule } from './modules/leave/leave.module.js';
import { RecruitmentModule } from './modules/recruitment/recruitment.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { PerformanceModule } from './modules/performance/performance.module.js';
import { AssetsModule } from './modules/assets/assets.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { ApprovalsModule } from './modules/approvals/approvals.module.js';
import { AuditModule } from './modules/audit/audit.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, storageConfig],
    }),
    DatabaseModule,
    StorageModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    RbacModule,
    CmsModule,
    HrmsModule,
    PayrollModule,
    AttendanceModule,
    LeaveModule,
    RecruitmentModule,
    DocumentsModule,
    PerformanceModule,
    AssetsModule,
    ProjectsModule,
    NotificationsModule,
    ApprovalsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
