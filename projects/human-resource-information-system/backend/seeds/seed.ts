import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { hash as bcryptHash } from 'bcrypt';
import { LegalEntity } from '../src/entities/legal_entity.entity.js';
import { Company } from '../src/entities/company.entity.js';
import { Branch } from '../src/entities/branch.entity.js';
import { Location } from '../src/entities/location.entity.js';
import { Department } from '../src/entities/department.entity.js';
import { Team } from '../src/entities/team.entity.js';
import { Position } from '../src/entities/position.entity.js';
import { JobLevel } from '../src/entities/job_level.entity.js';
import { EmploymentType } from '../src/entities/employment_type.entity.js';
import {
  WorkLocationType,
  WorkLocationTypeCode,
} from '../src/entities/work_location_type.entity.js';
import { CostCenter } from '../src/entities/cost_center.entity.js';
import { Role, RoleScope } from '../src/entities/role.entity.js';
import { RolePermission, RoleAction } from '../src/entities/role_permission.entity.js';
import { User } from '../src/entities/user.entity.js';
import { UserRole } from '../src/entities/user_role.entity.js';
import { Employee, EmployeeStatus } from '../src/entities/employee.entity.js';
import { LeaveType } from '../src/entities/leave_type.entity.js';
import { PayGroup } from '../src/entities/pay_group.entity.js';
import { getSeederDataSource, createSeederApp } from './seeder.js';
import type { DataSource, ObjectLiteral } from 'typeorm';
import type { TestingModule } from '@nestjs/testing';

const logger = new Logger('seeder');
const BCRYPT_ROUNDS = 10;
const today = new Date();
const hireDate = new Date('2024-03-01');

async function seed() {
  const module: TestingModule = await createSeederApp();
  const ds: DataSource = await getSeederDataSource(module);

  const legalRepo = ds.getRepository(LegalEntity);
  const companyRepo = ds.getRepository(Company);
  const branchRepo = ds.getRepository(Branch);
  const locationRepo = ds.getRepository(Location);
  const jobLevelRepo = ds.getRepository(JobLevel);
  const empTypeRepo = ds.getRepository(EmploymentType);
  const wltRepo = ds.getRepository(WorkLocationType);
  const ccRepo = ds.getRepository(CostCenter);
  const deptRepo = ds.getRepository(Department);
  const teamRepo = ds.getRepository(Team);
  const positionRepo = ds.getRepository(Position);
  const roleRepo = ds.getRepository(Role);
  const permRepo = ds.getRepository(RolePermission);
  const userRepo = ds.getRepository(User);
  const userRoleRepo = ds.getRepository(UserRole);
  const employeeRepo = ds.getRepository(Employee);
  const leaveTypeRepo = ds.getRepository(LeaveType);
  const payGroupRepo = ds.getRepository(PayGroup);

  // --- Root CMS ---
  const legalEntity = await ensureOne<LegalEntity>(
    legalRepo,
    { name: 'Hersvin Legal' },
    {
      name: 'Hersvin Legal',
      country: 'US',
      isActive: true,
    },
  );
  const company = await ensureOne<Company>(
    companyRepo,
    { name: 'Hersvin Inc' },
    {
      name: 'Hersvin Inc',
      shortCode: 'HER',
      isActive: true,
      legalEntityId: legalEntity.id,
    },
  );
  const branch = await ensureOne<Branch>(
    branchRepo,
    { companyId: company.id, code: 'HQ' },
    {
      companyId: company.id,
      name: 'Headquarters',
      code: 'HQ',
    },
  );
  await ensureOne<Location>(
    locationRepo,
    { name: 'Main Office' },
    {
      branchId: branch.id,
      name: 'Main Office',
      address: '100 Hersvin Way',
      tzName: 'America/New_York',
      isActive: true,
    },
  );

  // --- Dictionaries ---
  const jobLevels: JobLevel[] = [
    await ensureOne<JobLevel>(
      jobLevelRepo,
      { companyId: company.id, code: 'L1' },
      { companyId: company.id, code: 'L1', name: 'Junior', grade: '1' },
    ),
    await ensureOne<JobLevel>(
      jobLevelRepo,
      { companyId: company.id, code: 'L2' },
      { companyId: company.id, code: 'L2', name: 'Mid', grade: '2' },
    ),
    await ensureOne<JobLevel>(
      jobLevelRepo,
      { companyId: company.id, code: 'L3' },
      { companyId: company.id, code: 'L3', name: 'Senior', grade: '3' },
    ),
    await ensureOne<JobLevel>(
      jobLevelRepo,
      { companyId: company.id, code: 'L4' },
      { companyId: company.id, code: 'L4', name: 'Lead', grade: '4' },
    ),
  ];

  const empTypes: EmploymentType[] = [
    await ensureOne<EmploymentType>(
      empTypeRepo,
      { code: 'ft' },
      { code: 'ft', name: 'Full-time' },
    ),
    await ensureOne<EmploymentType>(
      empTypeRepo,
      { code: 'pt' },
      { code: 'pt', name: 'Part-time' },
    ),
    await ensureOne<EmploymentType>(
      empTypeRepo,
      { code: 'ct' },
      { code: 'ct', name: 'Contract' },
    ),
    await ensureOne<EmploymentType>(
      empTypeRepo,
      { code: 'in' },
      { code: 'in', name: 'Intern' },
    ),
  ];

  await ensureOne<WorkLocationType>(
    wltRepo,
    { code: WorkLocationTypeCode.OFFICE },
    { code: WorkLocationTypeCode.OFFICE, name: 'Office' },
  );
  await ensureOne<WorkLocationType>(
    wltRepo,
    { code: WorkLocationTypeCode.REMOTE },
    { code: WorkLocationTypeCode.REMOTE, name: 'Remote' },
  );
  await ensureOne<WorkLocationType>(
    wltRepo,
    { code: WorkLocationTypeCode.HYBRID },
    { code: WorkLocationTypeCode.HYBRID, name: 'Hybrid' },
  );

  await ensureOne<CostCenter>(
    ccRepo,
    { companyId: company.id, code: 'CC-GEN' },
    { companyId: company.id, code: 'CC-GEN', name: 'General' },
  );
  await ensureOne<CostCenter>(
    ccRepo,
    { companyId: company.id, code: 'CC-TECH' },
    { companyId: company.id, code: 'CC-TECH', name: 'Technology' },
  );

  // --- Org ---
  const hrDept = await ensureOne<Department>(
    deptRepo,
    { companyId: company.id, code: 'HR' },
    {
      companyId: company.id,
      branchId: branch.id,
      name: 'Human Resources',
      code: 'HR',
      validFrom: today,
    },
  );
  const techDept = await ensureOne<Department>(
    deptRepo,
    { companyId: company.id, code: 'ENG' },
    {
      companyId: company.id,
      branchId: branch.id,
      name: 'Engineering',
      code: 'ENG',
      validFrom: today,
    },
  );

  await ensureOne<Team>(
    teamRepo,
    { departmentId: hrDept.id, name: 'HR Ops' },
    { departmentId: hrDept.id, name: 'HR Ops', validFrom: today },
  );
  await ensureOne<Team>(
    teamRepo,
    { departmentId: techDept.id, name: 'Platform' },
    { departmentId: techDept.id, name: 'Platform', validFrom: today },
  );

  await ensureOne<Position>(
    positionRepo,
    { companyId: company.id, code: 'PM-HR' },
    {
      companyId: company.id,
      departmentId: hrDept.id,
      jobLevelId: jobLevels[2].id,
      employmentTypeId: empTypes[0].id,
      title: 'HR Manager',
      code: 'PM-HR',
      validFrom: today,
    },
  );
  await ensureOne<Position>(
    positionRepo,
    { companyId: company.id, code: 'SE' },
    {
      companyId: company.id,
      departmentId: techDept.id,
      jobLevelId: jobLevels[1].id,
      employmentTypeId: empTypes[0].id,
      title: 'Software Engineer',
      code: 'SE',
      validFrom: today,
    },
  );

  // --- RBAC ---
  const roles: Role[] = [
    await ensureOne<Role>(roleRepo, { code: 'admin' }, {
      code: 'admin',
      name: 'Administrator',
      isSystem: true,
      scope: RoleScope.SYSTEM,
    }),
    await ensureOne<Role>(roleRepo, { code: 'manager' }, {
      code: 'manager',
      name: 'Manager',
      isSystem: true,
      scope: RoleScope.MODULE,
    }),
    await ensureOne<Role>(roleRepo, { code: 'user' }, {
      code: 'user',
      name: 'User',
      isSystem: true,
      scope: RoleScope.MODULE,
    }),
  ];
  const [adminRole, managerRole, userRole] = roles;

  // Baseline role permissions
  const permDefs: Array<{
    role: Role;
    resource: string;
    action: RoleAction;
  }> = [
    { role: adminRole, resource: '*', action: RoleAction.READ },
    { role: adminRole, resource: '*', action: RoleAction.WRITE },
    { role: adminRole, resource: '*', action: RoleAction.APPROVE },
    { role: adminRole, resource: '*', action: RoleAction.DELETE },
    { role: adminRole, resource: '*', action: RoleAction.EXPORT },
    { role: managerRole, resource: 'employee', action: RoleAction.READ },
    { role: managerRole, resource: 'leave', action: RoleAction.APPROVE },
    { role: managerRole, resource: 'task', action: RoleAction.WRITE },
    { role: userRole, resource: 'employee', action: RoleAction.READ },
    { role: userRole, resource: 'leave', action: RoleAction.WRITE },
  ];
  for (const p of permDefs) {
    const existing = await permRepo.findOne({
      where: {
        roleId: p.role.id,
        resourceCode: p.resource,
        action: p.action,
      },
    });
    if (existing) continue;
    await permRepo.save(
      permRepo.create({
        roleId: p.role.id,
        resourceCode: p.resource,
        action: p.action,
        fieldMask: null,
      }),
    );
  }

  // --- Auth subjects ---
  const userDefs: Array<{
    email: string;
    fullName: string;
    password: string;
    role: Role;
  }> = [
    { email: 'admin@hersvin.dev', fullName: 'Admin', password: 'Admin@123', role: adminRole },
    { email: 'manager@hersvin.dev', fullName: 'Manager', password: 'Manager@123', role: managerRole },
    { email: 'user@hersvin.dev', fullName: 'User', password: 'User@123', role: userRole },
  ];
  for (const u of userDefs) {
    const existing = await userRepo.findOne({ where: { email: u.email } });
    if (existing) continue;
    const hash = await bcryptHash(u.password, BCRYPT_ROUNDS);
    const user = await userRepo.save(
      userRepo.create({
        email: u.email,
        fullName: u.fullName,
        passwordHash: hash,
        isActive: true,
      }),
    );
    await userRoleRepo.save(
      userRoleRepo.create({
        userId: user.id,
        roleId: u.role.id,
        grantedAt: new Date(),
        assignedBy: user.id,
      }),
    );
  }

  // --- HRMS: employee linked to user user ---
  const userUser = await userRepo.findOne({ where: { email: 'user@hersvin.dev' } });
  if (userUser) {
    await ensureOne<Employee>(employeeRepo, { empNo: 'EMP-0001' }, {
      userId: userUser.id,
      empNo: 'EMP-0001',
      firstName: 'Ella',
      lastName: 'Employee',
      status: EmployeeStatus.ACTIVE,
      hireDate,
      genderCode: 'F',
    });
  }

  // --- Leave types ---
  await ensureOne<LeaveType>(
    leaveTypeRepo,
    { companyId: company.id, code: 'annual' },
    {
      companyId: company.id,
      code: 'annual',
      name: 'Annual leave',
      isPaid: true,
      accrualRule: { rate: 'days', period: 'year', cap: 30 },
    },
  );
  await ensureOne<LeaveType>(
    leaveTypeRepo,
    { companyId: company.id, code: 'sick' },
    {
      companyId: company.id,
      code: 'sick',
      name: 'Sick leave',
      isPaid: true,
      accrualRule: { rate: 'days', period: 'year', cap: 14 },
    },
  );
  await ensureOne<LeaveType>(
    leaveTypeRepo,
    { companyId: company.id, code: 'unpaid' },
    {
      companyId: company.id,
      code: 'unpaid',
      name: 'Unpaid leave',
      isPaid: false,
    },
  );

  // --- Payroll ---
  await ensureOne<PayGroup>(
    payGroupRepo,
    { companyId: company.id, code: 'PG-MONTHLY' },
    {
      companyId: company.id,
      code: 'PG-MONTHLY',
      currency: 'USD',
      payPeriodType: 'monthly',
      nextRunDate: today,
    },
  );

  logger.log('Seed complete');
  await module.close();
}

/**
 * Ensure a single row exists keyed on the natural-key `where` filter.
 * Create if missing; no update if present (idempotent, no overwrite).
 */
async function ensureOne<T extends ObjectLiteral>(
  repo: Repository<T>,
  where: Partial<T>,
  payload: Partial<T>,
): Promise<T> {
  const existing = await repo.findOne({ where });
  if (existing) return existing;
  const created = repo.create(payload as T);
  return repo.save(created);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error('Seed failed', err as Error);
    process.exit(1);
  });
