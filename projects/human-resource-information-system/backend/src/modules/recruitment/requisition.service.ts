import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRequisition } from '../../entities/job_requisition.entity.js';
import { RequisitionStatus } from '../../entities/job_requisition.entity.js';

@Injectable()
export class RequisitionService {
  constructor(
    @InjectRepository(JobRequisition)
    private readonly requisitionRepo: Repository<JobRequisition>,
  ) {}

  async create(
    body: {
      companyId: string;
      positionId?: string;
      hiringManagerUserId?: string;
      headcount?: number;
      budgetRef?: string;
    },
  ): Promise<JobRequisition> {
    const requisition = this.requisitionRepo.create({
      ...body,
      status: RequisitionStatus.DRAFT,
    });
    return this.requisitionRepo.save(requisition);
  }

  async list(companyId?: string): Promise<JobRequisition[]> {
    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    return this.requisitionRepo.find({ where });
  }

  async approve(id: string): Promise<JobRequisition> {
    const requisition = await this.requisitionRepo.findOne({ where: { id } });
    if (!requisition) throw new NotFoundException(`Requisition ${id} not found`);
    requisition.status = RequisitionStatus.APPROVED;
    requisition.openedAt = new Date();
    return this.requisitionRepo.save(requisition);
  }

  async cancel(id: string): Promise<JobRequisition> {
    const requisition = await this.requisitionRepo.findOne({ where: { id } });
    if (!requisition) throw new NotFoundException(`Requisition ${id} not found`);
    requisition.status = RequisitionStatus.CANCELED;
    requisition.closedAt = new Date();
    return this.requisitionRepo.save(requisition);
  }
}
