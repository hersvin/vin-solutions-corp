import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity.js';
import { EmployeeMatchRule } from '../../entities/employee_match_rule.entity.js';

export interface DedupeMatch {
  existingEmployeeId: string;
  empNo: string;
  matchedFields: string[];
  confidence: number;
}

@Injectable()
export class DedupeService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeMatchRule) private readonly ruleRepo: Repository<EmployeeMatchRule>,
  ) {}

  async checkDedupe(
    input: { firstName: string; lastName: string; email?: string; govId?: string },
  ): Promise<DedupeMatch[]> {
    const rules = await this.ruleRepo.find();
    const matches: DedupeMatch[] = [];

    for (const rule of rules) {
      const field = rule.field.toLowerCase();
      let found: Employee[] = [];

      switch (field) {
        case 'firstname':
          found = await this.employeeRepo.find({ where: { firstName: input.firstName } });
          break;
        case 'lastname':
          found = await this.employeeRepo.find({ where: { lastName: input.lastName } });
          break;
        case 'email':
          if (input.email) {
            found = await this.employeeRepo
              .createQueryBuilder('e')
              .leftJoinAndSelect('e.user', 'u')
              .where('u.email = :email', { email: input.email })
              .getMany();
          }
          break;
        case 'govid':
          if (input.govId) {
            found = await this.employeeRepo.find({ where: { govIdMasked: input.govId } });
          }
          break;
      }

      for (const emp of found) {
        const confidence = rule.threshold ?? 0.5;
        matches.push({
          existingEmployeeId: emp.id,
          empNo: emp.empNo,
          matchedFields: [field],
          confidence,
        });
      }
    }

    return matches;
  }
}
