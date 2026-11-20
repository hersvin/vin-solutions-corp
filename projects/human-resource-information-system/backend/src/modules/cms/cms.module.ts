import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../entities/department.entity.js';
import { Team } from '../../entities/team.entity.js';
import { Position } from '../../entities/position.entity.js';
import { Location } from '../../entities/location.entity.js';
import { CostCenter } from '../../entities/cost_center.entity.js';
import { OrgChartSnapshot } from '../../entities/org_chart_snapshot.entity.js';
import { CmsController } from './cms.controller.js';
import { CmsService } from './cms.service.js';
import { OrgChartService } from './org-chart.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      Team,
      Position,
      Location,
      CostCenter,
      OrgChartSnapshot,
    ]),
  ],
  controllers: [CmsController],
  providers: [CmsService, OrgChartService],
  exports: [CmsService, OrgChartService],
})
export class CmsModule {}
