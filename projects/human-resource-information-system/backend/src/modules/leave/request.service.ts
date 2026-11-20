import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from '../../entities/leave_request.entity.js';
import { LeaveRequestStatus } from '../../entities/leave_request.entity.js';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly requestRepo: Repository<LeaveRequest>,
  ) {}

  async createRequest(
    body: {
      employeeId: string;
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      hours?: string;
    },
  ): Promise<LeaveRequest> {
    const request = this.requestRepo.create({
      ...body,
      status: LeaveRequestStatus.DRAFT,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
    return this.requestRepo.save(request);
  }

  async submit(requestId: string): Promise<LeaveRequest> {
    const request = await this.requestRepo.findOne({ where: { id: requestId } });
    if (!request) throw new NotFoundException(`Request ${requestId} not found`);
    request.status = LeaveRequestStatus.SUBMITTED;
    request.submittedAt = new Date();
    return this.requestRepo.save(request);
  }

  async cancel(requestId: string): Promise<LeaveRequest> {
    const request = await this.requestRepo.findOne({ where: { id: requestId } });
    if (!request) throw new NotFoundException(`Request ${requestId} not found`);
    request.status = LeaveRequestStatus.CANCELED;
    return this.requestRepo.save(request);
  }
}
