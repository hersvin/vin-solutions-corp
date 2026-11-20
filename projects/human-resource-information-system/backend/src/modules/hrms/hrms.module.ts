import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../entities/employee.entity.js';
import { EmployeeContact } from '../../entities/employee_contact.entity.js';
import { EmploymentRecord } from '../../entities/employment_record.entity.js';
import { EmployeeEvent } from '../../entities/employee_event.entity.js';
import { EmployeeMatchRule } from '../../entities/employee_match_rule.entity.js';
import { HrmsController } from './hrms.controller.js';
import { HrmsService } from './hrms.service.js';
import { LifecycleService } from './lifecycle.service.js';
import { DedupeService } from './dedupe.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeContact,
      EmploymentRecord,
      EmployeeEvent,
      EmployeeMatchRule,
    ]),
  ],
  controllers: [HrmsController],
  providers: [HrmsService, LifecycleService, DedupeService],
  exports: [HrmsService, LifecycleService, DedupeService],
})
export class HrmsModule {}
