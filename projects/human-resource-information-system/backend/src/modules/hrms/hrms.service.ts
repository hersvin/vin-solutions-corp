import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity.js';
import { EmployeeContact } from '../../entities/employee_contact.entity.js';
import { EmploymentRecord } from '../../entities/employment_record.entity.js';
import { EmployeeEvent } from '../../entities/employee_event.entity.js';

@Injectable()
export class HrmsService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeContact) private readonly contactRepo: Repository<EmployeeContact>,
    @InjectRepository(EmploymentRecord) private readonly empRecordRepo: Repository<EmploymentRecord>,
    @InjectRepository(EmployeeEvent) private readonly eventRepo: Repository<EmployeeEvent>,
  ) {}

  async listEmployees(status?: string, limit = 50, offset = 0): Promise<Employee[]> {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    return this.employeeRepo.find({
      where,
      take: limit,
      skip: offset,
      order: { empNo: 'ASC' },
    });
  }

  async getEmployee(empNo: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { empNo },
      relations: { user: true } as never,
    });
    if (!employee) throw new NotFoundException(`Employee ${empNo} not found`);
    return employee;
  }

  async createEmployee(body: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepo.create(body);
    return this.employeeRepo.save(employee);
  }

  async updateEmployee(empNo: string, body: Partial<Employee>): Promise<Employee> {
    const employee = await this.getEmployee(empNo);
    Object.assign(employee, body);
    return this.employeeRepo.save(employee);
  }

  async addEvent(
    employeeId: string,
    eventType: string,
    effectiveDate: Date,
    payload: Record<string, unknown> | null,
    initiatedBy: string,
  ): Promise<EmployeeEvent> {
    const event = this.eventRepo.create({
      employeeId,
      eventType: eventType as never,
      effectiveDate,
      payload,
      initiatedBy,
    });
    return this.eventRepo.save(event);
  }

  async getHistory(empNo: string): Promise<EmploymentRecord[]> {
    const employee = await this.getEmployee(empNo);
    return this.empRecordRepo.find({
      where: { employeeId: employee.id },
      order: { startDate: 'ASC' },
    });
  }
}
