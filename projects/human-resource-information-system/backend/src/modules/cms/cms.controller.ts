import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CmsService } from './cms.service.js';
import { OrgChartService } from './org-chart.service.js';

@Controller('cms')
export class CmsController {
  constructor(
    private readonly cmsService: CmsService,
    private readonly orgChartService: OrgChartService,
  ) {}

  @Get('org-chart')
  getOrgChart(
    @Query('companyId') companyId: string,
    @Query('asOf') asOf?: string,
  ) {
    return this.orgChartService.getOrgChart(companyId, asOf);
  }

  @Post('departments')
  createDepartment(@Body() body: Partial<Record<string, unknown>>) {
    return this.cmsService.createDepartment(body as never);
  }

  @Get('departments/:companyId')
  listDepartments(
    @Param('companyId') companyId: string,
    @Query('asOf') asOf?: string,
  ) {
    return this.cmsService.listDepartments(companyId, asOf);
  }

  @Post('teams')
  createTeam(@Body() body: Partial<Record<string, unknown>>) {
    return this.cmsService.createTeam(body as never);
  }

  @Post('positions')
  createPosition(@Body() body: Partial<Record<string, unknown>>) {
    return this.cmsService.createPosition(body as never);
  }

  @Get('locations')
  listLocations() {
    return this.cmsService.listLocations();
  }

  @Get('cost-centers/:companyId')
  listCostCenters(@Param('companyId') companyId: string) {
    return this.cmsService.listCostCenters(companyId);
  }
}
