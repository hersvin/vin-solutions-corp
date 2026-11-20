import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeeEvent } from '../../entities/employee_event.entity.js';
import { EmployeeEventType } from '../../entities/employee_event.entity.js';
import { HrmsService } from './hrms.service.js';

@Injectable()
export class LifecycleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly hrmsService: HrmsService,
    @InjectRepository(EmployeeEvent) private readonly eventRepo: Repository<EmployeeEvent>,
  ) {}

  async transfer(
    employeeId: string,
    effectiveDate: Date,
    payload: Record<string, unknown>,
    initiatedBy: string,
  ): Promise<EmployeeEvent> {
    return this.dataSource.transaction(async (tx) => {
      const event = await tx
        .getRepository(EmployeeEvent)
        .save(
          tx.getRepository(EmployeeEvent).create({
            employeeId,
            eventType: EmployeeEventType.TRANSFER,
            effectiveDate,
            payload,
            initiatedBy,
          }),
        );
      return event;
    });
  }

  async promote(
    employeeId: string,
    effectiveDate: Date,
    payload: Record<string, unknown>,
    initiatedBy: string,
  ): Promise<EmployeeEvent> {
    return this.dataSource.transaction(async (tx) => {
      const event = await tx
        .getRepository(EmployeeEvent)
        .save(
          tx.getRepository(EmployeeEvent).create({
            employeeId,
            eventType: EmployeeEventType.PROMOTE,
            effectiveDate,
            payload,
            initiatedBy,
          }),
        );
      return event;
    });
  }

  async terminate(
    employeeId: string,
    effectiveDate: Date,
    reasonCode: string,
    initiatedBy: string,
  ): Promise<EmployeeEvent> {
    return this.dataSource.transaction(async (tx) => {
      const event = await tx
        .getRepository(EmployeeEvent)
        .save(
          tx.getRepository(EmployeeEvent).create({
            employeeId,
            eventType: EmployeeEventType.TERMINATE,
            effectiveDate,
            payload: { reasonCode },
            initiatedBy,
          }),
        );
      return event;
    });
  }
}
