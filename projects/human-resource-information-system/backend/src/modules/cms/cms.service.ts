import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Department } from '../../entities/department.entity.js';
import { Team } from '../../entities/team.entity.js';
import { Position } from '../../entities/position.entity.js';
import { Location } from '../../entities/location.entity.js';
import { CostCenter } from '../../entities/cost_center.entity.js';
import { OrgChartSnapshot } from '../../entities/org_chart_snapshot.entity.js';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Department) private readonly deptRepo: Repository<Department>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(Position) private readonly positionRepo: Repository<Position>,
    @InjectRepository(Location) private readonly locationRepo: Repository<Location>,
    @InjectRepository(CostCenter) private readonly ccRepo: Repository<CostCenter>,
    @InjectRepository(OrgChartSnapshot) private readonly snapshotRepo: Repository<OrgChartSnapshot>,
  ) {}

  async createDepartment(body: Partial<Department>): Promise<Department> {
    const dept = this.deptRepo.create(body);
    return this.deptRepo.save(dept);
  }

  async listDepartments(companyId: string, asOf?: string): Promise<Department[]> {
    const where: FindOptionsWhere<Department> = { companyId } as FindOptionsWhere<Department>;
    if (asOf) {
      where.validFrom = { lessThanOrEqual: asOf } as never;
      where.validTo = { greaterThan: asOf } as never;
    }
    return this.deptRepo.find({ where });
  }

  async createTeam(body: Partial<Team>): Promise<Team> {
    const team = this.teamRepo.create(body);
    return this.teamRepo.save(team);
  }

  async createPosition(body: Partial<Position>): Promise<Position> {
    const position = this.positionRepo.create(body);
    return this.positionRepo.save(position);
  }

  async listPositions(companyId: string, asOf?: string): Promise<Position[]> {
    const where: FindOptionsWhere<Position> = { companyId } as FindOptionsWhere<Position>;
    if (asOf) where.validFrom = { lessThanOrEqual: asOf } as never;
    return this.positionRepo.find({ where });
  }

  async listLocations(): Promise<Location[]> {
    return this.locationRepo.find();
  }

  async listCostCenters(companyId: string): Promise<CostCenter[]> {
    return this.ccRepo.find({ where: { companyId } });
  }

  async takeOrgChartSnapshot(companyId: string): Promise<OrgChartSnapshot> {
    const positions = await this.listPositions(companyId);
    const snapshot = this.snapshotRepo.create({
      companyId,
      takenAt: new Date(),
      payload: { positions },
    } as Partial<OrgChartSnapshot>);
    return this.snapshotRepo.save(snapshot);
  }
}
