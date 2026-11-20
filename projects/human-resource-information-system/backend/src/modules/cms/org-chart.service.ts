import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../../entities/position.entity.js';

export interface OrgChartNode {
  positionId: string;
  title: string;
  code: string | null;
  departmentId: string | null;
  reportsToPositionId: string | null;
  validFrom: Date;
  validTo: Date | null;
  children: OrgChartNode[];
}

@Injectable()
export class OrgChartService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepo: Repository<Position>,
  ) {}

  async getOrgChart(companyId: string, asOf?: string): Promise<OrgChartNode[]> {
    const qb = this.positionRepo
      .createQueryBuilder('p')
      .where('p.company_id = :companyId', { companyId });
    if (asOf) {
      qb.andWhere('p.valid_from <= :asOf', { asOf });
      qb.andWhere('(p.valid_to IS NULL OR p.valid_to > :asOf)', { asOf });
    }
    const positions = await qb.getMany();

    const nodeMap = new Map<string, OrgChartNode>();
    const nodes: OrgChartNode[] = positions.map((p) => {
      const node: OrgChartNode = {
        positionId: p.id,
        title: p.title,
        code: p.code,
        departmentId: p.departmentId,
        reportsToPositionId: p.reportsToPositionId,
        validFrom: p.validFrom,
        validTo: p.validTo,
        children: [],
      };
      nodeMap.set(p.id, node);
      return node;
    });

    const roots: OrgChartNode[] = [];
    for (const node of nodes) {
      if (node.reportsToPositionId) {
        const parent = nodeMap.get(node.reportsToPositionId);
        if (parent) {
          parent.children.push(node);
          continue;
        }
      }
      roots.push(node);
    }
    return roots;
  }
}
